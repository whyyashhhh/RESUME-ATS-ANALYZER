from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


def ai_resume_analysis(resume_text: str, job_description: str):

    prompt = f"""
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    response = client.models.generate_content(
        model="models/gemini-3.5-flash",
        contents=prompt
    )

    return response.text