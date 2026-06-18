from __future__ import annotations

from app.services.analysis_service import analyze_resume_text


def test_analysis_service_detects_keywords() -> None:
    resume_text = 'Python FastAPI SQLAlchemy developer with Docker and PostgreSQL experience.'
    job_description = 'Looking for a Python developer with FastAPI, PostgreSQL, and Docker skills.'

    result = analyze_resume_text(resume_text, job_description, target_role='Software Engineer')

    assert result['ats_score'] > 0
    assert 'python' in result['matched_keywords']
    assert 'docker' in result['matched_keywords']
    assert isinstance(result['analysis_json'], dict)
