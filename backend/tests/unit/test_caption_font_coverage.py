from src.font_registry import (
    FONTS_DIR,
    font_cap_height_ratio,
    font_draws_lowercase_as_capitals,
    get_font_glyph_map,
)
from src.media.captions import CaptionFontCoverage


def test_font_without_accents_is_detected():
    glyphs = get_font_glyph_map(str(FONTS_DIR / "THEBOLDFONT.ttf"))
    assert ord("A") in glyphs
    assert ord("Ã") not in glyphs
    assert ord("Ã") in get_font_glyph_map(str(FONTS_DIR / "Poppins-ExtraBold.ttf"))


def test_caps_only_font_is_detected():
    assert font_draws_lowercase_as_capitals(str(FONTS_DIR / "THEBOLDFONT.ttf"))
    assert not font_draws_lowercase_as_capitals(str(FONTS_DIR / "Poppins-ExtraBold.ttf"))


def test_accented_letters_use_a_matching_fallback_font():
    coverage = CaptionFontCoverage("THEBOLDFONT", "THE BOLD FONT")

    rendered = coverage.render(coverage.prepare("é uma ilusão"), 80)

    # The fallback capitals are scaled up to the display font's cap height.
    primary = font_cap_height_ratio(str(FONTS_DIR / "THEBOLDFONT.ttf"))
    secondary = font_cap_height_ratio(str(FONTS_DIR / "Poppins-ExtraBold.ttf"))
    enter = r"{\fnPoppins ExtraBold\fs" + str(round(80 * primary / secondary)) + "}"
    leave = r"{\fnTHE BOLD FONT\fs80}"
    assert rendered == f"{enter}É{leave} UMA ILUS{enter}Ã{leave}O"


def test_fonts_with_full_coverage_are_untouched():
    coverage = CaptionFontCoverage("TikTokSans-Bold", "TikTok Sans")

    assert coverage.render(coverage.prepare("é uma ilusão"), 80) == "é uma ilusão"
