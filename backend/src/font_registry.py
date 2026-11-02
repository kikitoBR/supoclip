from pathlib import Path
from typing import Any
from functools import lru_cache
import re
import struct
import subprocess

SUPPORTED_FONT_EXTENSIONS = (".ttf", ".otf")
FONTS_DIR = Path(__file__).parent.parent / "fonts"
USER_FONTS_DIR = FONTS_DIR / "users"
TTF_NAME_ID_FONT_FAMILY = 1
TTF_NAME_ID_FULL_NAME = 4
ASS_UNSAFE_NAME_CHARS = frozenset("(){}\\")


def _display_name(font_stem: str) -> str:
    return font_stem.replace("-", " ").replace("_", " ").strip().title()


@lru_cache(maxsize=256)
def _query_font_languages(path: str, modified_ns: int, size: int) -> tuple[str, ...] | None:
    """Fontconfig compares this file's glyph coverage with language orthographies.

    The stat arguments invalidate cached results when an uploaded font changes.
    None means unavailable/invalid; an empty tuple means no covered orthographies.
    """
    try:
        result = subprocess.run(
            ["fc-query", "--format=%{lang}\\n", path],
            capture_output=True,
            text=True,
            timeout=5,
            check=True,
        )
    except (OSError, subprocess.SubprocessError):
        return None

    # Variable fonts can return several faces with the same coverage. Only report
    # languages covered by every face so the note is true for any selected weight.
    faces = [set(line.strip().split("|")) - {""} for line in result.stdout.splitlines()]
    if not faces:
        return None
    return tuple(sorted(set.intersection(*faces)))


def get_font_languages(font_path: Path) -> list[str] | None:
    try:
        stat = font_path.stat()
    except OSError:
        return None
    languages = _query_font_languages(str(font_path.resolve()), stat.st_mtime_ns, stat.st_size)
    return list(languages) if languages is not None else None


def sanitize_user_id_for_path(user_id: str) -> str:
    safe_value = re.sub(r"[^A-Za-z0-9_-]", "-", user_id).strip("-")
    return safe_value or "user"


def get_user_fonts_dir(user_id: str) -> Path:
    return USER_FONTS_DIR / sanitize_user_id_for_path(user_id)


def find_user_font_path(font_name: str, user_id: str) -> Path | None:
    """Resolve an exact font name inside one user's upload directory only."""
    requested = font_name.strip()
    if not requested or Path(requested).name != requested:
        return None

    user_fonts_dir = get_user_fonts_dir(user_id)
    exact_file = user_fonts_dir / requested
    if (
        exact_file.is_file()
        and exact_file.suffix.lower() in SUPPORTED_FONT_EXTENSIONS
    ):
        return exact_file

    if Path(requested).suffix:
        return None

    for extension in SUPPORTED_FONT_EXTENSIONS:
        candidate = user_fonts_dir / f"{requested}{extension}"
        if candidate.is_file():
            return candidate

    return None


def _collect_fonts_from_dir(font_dir: Path, scope: str) -> list[dict[str, Any]]:
    if not font_dir.exists():
        return []

    fonts: list[dict[str, Any]] = []
    for extension in SUPPORTED_FONT_EXTENSIONS:
        for font_path in sorted(font_dir.glob(f"*{extension}")):
            fonts.append(
                {
                    "name": font_path.stem,
                    "display_name": _display_name(font_path.stem),
                    "filename": font_path.name,
                    "format": extension.lstrip("."),
                    "file_path": str(font_path),
                    "scope": scope,
                    "supported_languages": get_font_languages(font_path),
                }
            )

    return fonts


def get_available_fonts(user_id: str | None = None) -> list[dict[str, Any]]:
    fonts: list[dict[str, Any]] = _collect_fonts_from_dir(FONTS_DIR, scope="system")

    if user_id:
        fonts.extend(_collect_fonts_from_dir(get_user_fonts_dir(user_id), scope="user"))

    return sorted(fonts, key=lambda font: font["display_name"])


def find_font_path(
    font_name: str,
    user_id: str | None = None,
    allow_all_user_fonts: bool = False,
) -> Path | None:
    requested = font_name.strip()
    if not requested:
        return None

    search_dirs = [FONTS_DIR]
    if user_id:
        search_dirs.insert(0, get_user_fonts_dir(user_id))

    for search_dir in search_dirs:
        exact_file = search_dir / requested
        if (
            exact_file.exists()
            and exact_file.suffix.lower() in SUPPORTED_FONT_EXTENSIONS
        ):
            return exact_file

        for extension in SUPPORTED_FONT_EXTENSIONS:
            candidate = search_dir / f"{requested}{extension}"
            if candidate.exists():
                return candidate

    normalized_requested = re.sub(r"[^a-z0-9]", "", requested.lower())
    for font in get_available_fonts(user_id):
        normalized_name = re.sub(r"[^a-z0-9]", "", font["name"].lower())
        if normalized_requested == normalized_name:
            return Path(font["file_path"])

    if allow_all_user_fonts:
        for font_path in USER_FONTS_DIR.glob(f"**/{requested}.*"):
            if font_path.suffix.lower() in SUPPORTED_FONT_EXTENSIONS:
                return font_path

    return None


def _decode_ttf_name(raw_value: bytes, platform_id: int) -> str:
    encodings = ["utf-16-be"] if platform_id in {0, 3} else ["mac_roman", "utf-8"]
    for encoding in encodings:
        try:
            decoded = raw_value.decode(encoding).strip("\x00").strip()
        except UnicodeDecodeError:
            continue
        if decoded:
            return decoded
    return ""


def get_font_family_name(font_path: Path) -> str | None:
    """Read a font's internal family name for renderers that match by metadata."""
    try:
        data = Path(font_path).read_bytes()
        if len(data) < 12:
            return None

        num_tables = struct.unpack_from(">H", data, 4)[0]
        name_table_offset = None
        name_table_length = None
        table_record_offset = 12
        for table_index in range(num_tables):
            record_offset = table_record_offset + table_index * 16
            if record_offset + 16 > len(data):
                return None
            tag, _checksum, table_offset, table_length = struct.unpack_from(
                ">4sIII", data, record_offset
            )
            if tag == b"name":
                name_table_offset = table_offset
                name_table_length = table_length
                break

        if name_table_offset is None or name_table_length is None:
            return None
        if name_table_offset + min(name_table_length, 6) > len(data):
            return None

        _format_selector, record_count, string_offset = struct.unpack_from(
            ">HHH", data, name_table_offset
        )
        storage_start = name_table_offset + string_offset
        candidates: dict[int, list[str]] = {
            TTF_NAME_ID_FONT_FAMILY: [],
            TTF_NAME_ID_FULL_NAME: [],
        }

        for record_index in range(record_count):
            record_offset = name_table_offset + 6 + record_index * 12
            if record_offset + 12 > len(data):
                break
            (
                platform_id,
                _encoding_id,
                language_id,
                name_id,
                value_length,
                value_offset,
            ) = struct.unpack_from(">HHHHHH", data, record_offset)
            if name_id not in candidates:
                continue
            value_start = storage_start + value_offset
            value_end = value_start + value_length
            if value_start < storage_start or value_end > len(data):
                continue
            decoded = _decode_ttf_name(data[value_start:value_end], platform_id)
            if not decoded:
                continue
            # Prefer English records when present, but keep every valid name as fallback.
            if language_id in {0x0409, 0x0000}:
                candidates[name_id].insert(0, decoded)
            else:
                candidates[name_id].append(decoded)

        family_names = list(dict.fromkeys(candidates[TTF_NAME_ID_FONT_FAMILY]))
        full_names = [name for name in candidates[TTF_NAME_ID_FULL_NAME] if name]
        # ASS override tags (\fn<name>) end at "(", "{" or "\", so a family like
        # "THE BOLD FONT (FREE VERSION)" silently falls back to another font.
        # libass also matches full names, so prefer any tag-safe candidate.
        for names in (family_names, full_names):
            safe_names = [name for name in names if not ASS_UNSAFE_NAME_CHARS & set(name)]
            if safe_names:
                return min(safe_names, key=len)

        if family_names:
            return min(family_names, key=len)
        if full_names:
            return full_names[0]
    except Exception:
        return None

    return None


def _cmap_format4_glyphs(data: bytes, start: int) -> dict[int, int]:
    seg_count = struct.unpack_from(">H", data, start + 6)[0] // 2
    ends_at = start + 14
    starts_at = ends_at + seg_count * 2 + 2
    deltas_at = starts_at + seg_count * 2
    ranges_at = deltas_at + seg_count * 2
    glyphs: dict[int, int] = {}
    for seg in range(seg_count):
        end = struct.unpack_from(">H", data, ends_at + seg * 2)[0]
        first = struct.unpack_from(">H", data, starts_at + seg * 2)[0]
        delta = struct.unpack_from(">h", data, deltas_at + seg * 2)[0]
        range_offset = struct.unpack_from(">H", data, ranges_at + seg * 2)[0]
        for code in range(first, min(end, 0xFFFE) + 1):
            if range_offset == 0:
                glyph = (code + delta) & 0xFFFF
            else:
                at = ranges_at + seg * 2 + range_offset + (code - first) * 2
                if at + 2 > len(data):
                    continue
                glyph = struct.unpack_from(">H", data, at)[0]
                if glyph:
                    glyph = (glyph + delta) & 0xFFFF
            if glyph:
                glyphs[code] = glyph
    return glyphs


def _cmap_format12_glyphs(data: bytes, start: int) -> dict[int, int]:
    group_count = struct.unpack_from(">I", data, start + 12)[0]
    glyphs: dict[int, int] = {}
    for group in range(group_count):
        first, last, glyph = struct.unpack_from(">III", data, start + 16 + group * 12)
        for offset, code in enumerate(range(first, min(last, 0x2FFFF) + 1)):
            glyphs[code] = glyph + offset
    return glyphs


@lru_cache(maxsize=64)
def get_font_glyph_map(font_path: str) -> dict[int, int] | None:
    """Codepoint → glyph id from a font's Unicode cmap, or None if unreadable.

    Lets the caption renderer spot characters a display font cannot draw (many
    free display fonts ship without accented letters) and caps-only fonts that
    draw lowercase letters with the capital glyphs.
    """
    try:
        data = Path(font_path).read_bytes()
        num_tables = struct.unpack_from(">H", data, 4)[0]
        cmap_offset = None
        for table_index in range(num_tables):
            tag, _checksum, table_offset, _length = struct.unpack_from(
                ">4sIII", data, 12 + table_index * 16
            )
            if tag == b"cmap":
                cmap_offset = table_offset
                break
        if cmap_offset is None:
            return None
        subtable_count = struct.unpack_from(">H", data, cmap_offset + 2)[0]
        glyphs: dict[int, int] = {}
        for index in range(subtable_count):
            platform_id, encoding_id, offset = struct.unpack_from(
                ">HHI", data, cmap_offset + 4 + index * 8
            )
            if not (platform_id == 0 or (platform_id == 3 and encoding_id in (1, 10))):
                continue
            start = cmap_offset + offset
            table_format = struct.unpack_from(">H", data, start)[0]
            if table_format == 4:
                glyphs.update(_cmap_format4_glyphs(data, start))
            elif table_format == 12:
                glyphs.update(_cmap_format12_glyphs(data, start))
        return glyphs or None
    except Exception:
        return None


@lru_cache(maxsize=64)
def font_cap_height_ratio(font_path: str) -> float | None:
    """Height of the capital "H" relative to the size libass gives the font.

    libass (like VSFilter) maps the ASS font size onto the OS/2 Windows
    ascent + descent, not the em, so two fonts at the same size can have very
    different capitals. None when the font cannot be read.
    """
    glyphs = get_font_glyph_map(font_path)
    if not glyphs or ord("H") not in glyphs:
        return None
    try:
        data = Path(font_path).read_bytes()
        num_tables = struct.unpack_from(">H", data, 4)[0]
        tables: dict[bytes, int] = {}
        for table_index in range(num_tables):
            tag, _checksum, table_offset, _length = struct.unpack_from(
                ">4sIII", data, 12 + table_index * 16
            )
            tables[tag] = table_offset
        if not {b"glyf", b"loca", b"head"} <= tables.keys():
            return None
        units_per_em = struct.unpack_from(">H", data, tables[b"head"] + 18)[0]
        long_offsets = struct.unpack_from(">h", data, tables[b"head"] + 50)[0] == 1
        glyph = glyphs[ord("H")]
        if long_offsets:
            start = struct.unpack_from(">I", data, tables[b"loca"] + glyph * 4)[0]
        else:
            start = struct.unpack_from(">H", data, tables[b"loca"] + glyph * 2)[0] * 2
        y_max = struct.unpack_from(">h", data, tables[b"glyf"] + start + 8)[0]
        line_height = units_per_em
        if b"OS/2" in tables:
            win_ascent, win_descent = struct.unpack_from(">HH", data, tables[b"OS/2"] + 74)
            line_height = win_ascent + win_descent or units_per_em
        return y_max / line_height if line_height and y_max > 0 else None
    except Exception:
        return None


@lru_cache(maxsize=64)
def font_draws_lowercase_as_capitals(font_path: str) -> bool:
    """Whether a caps-only display font reuses the capital outlines for a-z.

    Such fonts show "ilusão" as "ILUSãO" when the accented letter has to come
    from a fallback font, so captions in them are uppercased up front.
    """
    glyphs = get_font_glyph_map(font_path)
    if not glyphs:
        return False
    try:
        data = Path(font_path).read_bytes()
        num_tables = struct.unpack_from(">H", data, 4)[0]
        tables: dict[bytes, int] = {}
        for table_index in range(num_tables):
            tag, _checksum, table_offset, _length = struct.unpack_from(
                ">4sIII", data, 12 + table_index * 16
            )
            tables[tag] = table_offset
        if not {b"glyf", b"loca", b"head"} <= tables.keys():
            return False
        long_offsets = struct.unpack_from(">h", data, tables[b"head"] + 50)[0] == 1

        def outline(code: int) -> bytes | None:
            glyph = glyphs.get(code)
            if glyph is None:
                return None
            if long_offsets:
                start, end = struct.unpack_from(">II", data, tables[b"loca"] + glyph * 4)
            else:
                start, end = (v * 2 for v in struct.unpack_from(">HH", data, tables[b"loca"] + glyph * 2))
            return data[tables[b"glyf"] + start : tables[b"glyf"] + end]

        letters = "abcdefghijklmnopqrstuvwxyz"
        same = sum(
            1 for letter in letters
            if outline(ord(letter)) is not None and outline(ord(letter)) == outline(ord(letter.upper()))
        )
        return same >= 20
    except Exception:
        return False


def sanitize_font_stem(file_name: str) -> str:
    raw_stem = Path(file_name).stem
    safe_stem = re.sub(r"[^A-Za-z0-9_-]", "-", raw_stem).strip("-")
    if not safe_stem:
        raise ValueError("Nome de arquivo de fonte inválido")
    return safe_stem


def build_user_font_stem(user_id: str, original_stem: str) -> str:
    safe_stem = sanitize_font_stem(original_stem)
    safe_user = sanitize_user_id_for_path(user_id)
    return f"usr-{safe_user}-{safe_stem}".lower()


def is_font_accessible(font_name: str, user_id: str) -> bool:
    return find_font_path(font_name, user_id=user_id) is not None
