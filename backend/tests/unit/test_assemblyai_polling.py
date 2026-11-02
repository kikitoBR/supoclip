from types import SimpleNamespace
from unittest.mock import Mock
from pathlib import Path

import httpx
import pytest

from src.media import transcription


def polling_job(monkeypatch, handler):
    client = httpx.Client(base_url="https://api.assemblyai.com", transport=httpx.MockTransport(handler))
    sdk_client = SimpleNamespace(http_client=client)
    submitted = SimpleNamespace(id="existing-job", _client=sdk_client)
    transcriber = SimpleNamespace(
        upload_file=Mock(return_value="https://cdn.assemblyai.com/audio"),
        submit=Mock(return_value=submitted),
    )
    # The real SDK response parser runs; only the final cache-rich Transcript is stubbed.
    monkeypatch.setattr(transcription.aai.Transcript, "from_response", lambda **kwargs: kwargs["response"])
    monkeypatch.setattr(transcription.time, "sleep", lambda _: None)
    return transcriber, client


def response(status):
    return httpx.Response(200, json={"id": "existing-job", "status": status, "audio_url": "https://example.com/audio.mp3"})


def test_poll_timeout_retries_same_job_and_uses_short_request_timeout(monkeypatch):
    requests = []
    def handler(request):
        requests.append(request)
        if len(requests) == 1:
            raise httpx.ReadTimeout("temporary timeout", request=request)
        return response("completed")
    transcriber, client = polling_job(monkeypatch, handler)
    try:
        result = transcription._submit_and_wait_for_assemblyai_transcript(transcriber, Path("audio.mp3"), None, 900)
    finally:
        client.close()
    assert result.status == "completed"
    transcriber.submit.assert_called_once()
    assert all(str(r.url).endswith("/transcript/existing-job") for r in requests)
    assert all(r.extensions["timeout"]["read"] == 30 for r in requests)


def test_expired_budget_stops_before_another_poll(monkeypatch):
    requests = []
    def handler(request):
        requests.append(request)
        return response("processing")
    transcriber, client = polling_job(monkeypatch, handler)
    clock = iter([0, 0, 1, 2])
    monkeypatch.setattr(transcription.time, "monotonic", lambda: next(clock))
    try:
        with pytest.raises(TimeoutError, match="within 2s"):
            transcription._submit_and_wait_for_assemblyai_transcript(transcriber, Path("audio.mp3"), None, 2)
    finally:
        client.close()
    assert len(requests) == 1
    assert requests[0].extensions["timeout"]["read"] == 2
    transcriber.submit.assert_called_once()


def test_transcription_timeout_does_not_resubmit_paid_job(monkeypatch, tmp_path):
    runtime_config = SimpleNamespace(
        assembly_ai_api_key="test", assembly_ai_http_timeout_seconds=2, transcription_language=""
    )
    helper = Mock(side_effect=TimeoutError("deadline exceeded"))
    monkeypatch.setattr(transcription, "_submit_and_wait_for_assemblyai_transcript", helper)
    monkeypatch.setattr(transcription, "_prepare_audio_for_transcription", lambda path: path)
    with pytest.raises(TimeoutError):
        transcription._get_transcript_with_assemblyai(tmp_path / "video.mp4", "universal", runtime_config)
    helper.assert_called_once()


def test_upload_timeout_retries_before_single_paid_submission(monkeypatch):
    transcriber, client = polling_job(monkeypatch, lambda _: response("completed"))
    audio_url = "https://cdn.assemblyai.com/audio"
    transcriber.upload_file.side_effect = [httpx.ReadTimeout("upload timeout"), audio_url]
    try:
        transcription._submit_and_wait_for_assemblyai_transcript(transcriber, Path("audio.mp3"), None, 900)
    finally:
        client.close()
    assert transcriber.upload_file.call_count == 2
    transcriber.submit.assert_called_once_with(audio_url, config=None)


def test_exhausted_upload_retries_do_not_submit_transcript(monkeypatch):
    transcriber, client = polling_job(monkeypatch, lambda _: response("completed"))
    transcriber.upload_file.side_effect = httpx.ConnectError("upload unavailable")
    try:
        with pytest.raises(httpx.ConnectError):
            transcription._submit_and_wait_for_assemblyai_transcript(transcriber, Path("audio.mp3"), None, 900)
    finally:
        client.close()
    assert transcriber.upload_file.call_count == 3
    transcriber.submit.assert_not_called()


def test_submission_timeout_is_not_retried(monkeypatch):
    transcriber, client = polling_job(monkeypatch, lambda _: response("completed"))
    transcriber.submit.side_effect = httpx.ReadTimeout("submission response lost")
    try:
        with pytest.raises(httpx.ReadTimeout):
            transcription._submit_and_wait_for_assemblyai_transcript(transcriber, Path("audio.mp3"), None, 900)
    finally:
        client.close()
    transcriber.upload_file.assert_called_once()
    transcriber.submit.assert_called_once()


@pytest.mark.parametrize(
    ("language", "expected_code", "expected_detection"),
    [("", None, True), ("es", "es", None)],
)
def test_language_is_detected_unless_configured(
    monkeypatch, tmp_path, language, expected_code, expected_detection
):
    runtime_config = SimpleNamespace(
        assembly_ai_api_key="test", assembly_ai_http_timeout_seconds=2, transcription_language=language
    )
    helper = Mock(side_effect=TimeoutError("stop after submit"))
    monkeypatch.setattr(transcription, "_submit_and_wait_for_assemblyai_transcript", helper)
    monkeypatch.setattr(transcription, "_prepare_audio_for_transcription", lambda path: path)
    with pytest.raises(TimeoutError):
        transcription._get_transcript_with_assemblyai(tmp_path / "video.mp4", "universal", runtime_config)
    config = helper.call_args.args[2]
    assert config.language_code == expected_code
    assert config.language_detection is expected_detection


def _fallback_config(**overrides):
    values = dict(
        assembly_ai_api_key="primary",
        assembly_ai_fallback_api_keys=["backup", "primary"],
        assembly_ai_http_timeout_seconds=2,
        transcription_language="pt",
    )
    values.update(overrides)
    return SimpleNamespace(**values)


def _stub_after_transcript(monkeypatch):
    monkeypatch.setattr(transcription, "_prepare_audio_for_transcription", lambda path: path)
    monkeypatch.setattr(transcription, "format_transcript_for_analysis", lambda transcript: ["[00:00 - 00:01] oi"])
    monkeypatch.setattr(transcription, "cache_transcript_data", lambda path, transcript: None)


def test_rejected_key_falls_back_to_next_account(monkeypatch, tmp_path):
    _stub_after_transcript(monkeypatch)
    done = SimpleNamespace(status=transcription.aai.TranscriptStatus.completed, json_response={})
    used_keys = []

    def submit(transcriber, *args):
        used_keys.append(transcriber._client._settings.api_key)
        if len(used_keys) == 1:
            raise transcription.aai.TranscriptError("account balance is negative", 401)
        return done

    monkeypatch.setattr(transcription, "_submit_and_wait_for_assemblyai_transcript", submit)
    result = transcription._get_transcript_with_assemblyai(tmp_path / "video.mp4", "universal", _fallback_config())
    assert result == "[00:00 - 00:01] oi"
    assert used_keys == ["primary", "backup"]


def test_request_errors_do_not_try_other_accounts(monkeypatch, tmp_path):
    _stub_after_transcript(monkeypatch)
    helper = Mock(side_effect=transcription.aai.TranscriptError("unsupported audio", 400))
    monkeypatch.setattr(transcription, "_submit_and_wait_for_assemblyai_transcript", helper)
    with pytest.raises(transcription.aai.TranscriptError):
        transcription._get_transcript_with_assemblyai(tmp_path / "video.mp4", "universal", _fallback_config())
    helper.assert_called_once()


def test_last_key_failure_is_raised(monkeypatch, tmp_path):
    _stub_after_transcript(monkeypatch)
    helper = Mock(side_effect=transcription.aai.TranscriptError("rate limited", 429))
    monkeypatch.setattr(transcription, "_submit_and_wait_for_assemblyai_transcript", helper)
    with pytest.raises(transcription.aai.TranscriptError):
        transcription._get_transcript_with_assemblyai(tmp_path / "video.mp4", "universal", _fallback_config())
    assert helper.call_count == 2
