from google import genai

from app.core.config import settings


_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client

    if _client is not None:
        return _client

    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def ai_resume_analysis(resume_text: str, job_description: str):

    prompt = f"""
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    client = get_client()

    response = client.models.generate_content(
        model="models/gemini-3.5-flash",
        contents=prompt
    )

    return response.text