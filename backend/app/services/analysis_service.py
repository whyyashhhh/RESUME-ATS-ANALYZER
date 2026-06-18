from __future__ import annotations

from collections import Counter
import re

from app.core.config import settings
from app.utils.file_processing import clean_extracted_text

SKILL_KEYWORDS = {
    'python', 'fastapi', 'sqlalchemy', 'postgresql', 'react', 'typescript', 'javascript', 'docker',
    'kubernetes', 'aws', 'azure', 'gcp', 'langchain', 'chromadb', 'gemini', 'nlp', 'rag', 'machine learning',
    'data analysis', 'pandas', 'numpy', 'git', 'ci/cd', 'testing', 'pytest', 'communication', 'leadership',
    'problem solving', 'sql', 'api', 'rest', 'graphql', 'tailwind', 'vite', 'linux', 'firebase', 'mongodb',
}

SECTION_HEADINGS = {'experience', 'work experience', 'education', 'skills', 'projects', 'summary', 'certifications'}
EDUCATION_TERMS = {'bachelor', 'master', 'phd', 'degree', 'computer science', 'engineering'}


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z][a-zA-Z0-9+/.-]{1,}", text.lower())


def extract_keywords(text: str) -> list[str]:
    normalized = clean_extracted_text(text).lower()
    return sorted({keyword for keyword in SKILL_KEYWORDS if keyword in normalized})


def score_keyword_match(resume_text: str, job_description: str) -> tuple[float, list[str], list[str]]:
    resume_keywords = set(extract_keywords(resume_text))
    job_keywords = set(extract_keywords(job_description))
    matched = sorted(resume_keywords & job_keywords)
    missing = sorted(job_keywords - resume_keywords)
    percentage = round((len(matched) / max(len(job_keywords), 1)) * 100, 1)
    return percentage, matched, missing


def score_skills(resume_text: str, job_description: str) -> tuple[float, list[str]]:
    resume_keywords = set(extract_keywords(resume_text))
    job_keywords = set(extract_keywords(job_description))
    matched = sorted(resume_keywords & job_keywords)
    score = round(min(25.0, (len(matched) / max(len(job_keywords), 1)) * 25), 1)
    return score, matched


def score_experience(job_description: str, resume_text: str, target_role: str | None) -> float:
    job_tokens = Counter(tokenize(job_description))
    resume_tokens = Counter(tokenize(resume_text))
    overlap = sum((job_tokens & resume_tokens).values())
    base = min(12.0, overlap / 6)
    role_bonus = 2.5 if target_role and target_role.lower() in resume_text.lower() else 0.0
    action_bonus = 1.5 if any(word in resume_text.lower() for word in ['led', 'built', 'developed', 'managed', 'improved']) else 0.0
    return round(min(20.0, base + role_bonus + action_bonus + 4.0), 1)


def score_education(job_description: str, resume_text: str) -> float:
    job_mentions = any(term in job_description.lower() for term in EDUCATION_TERMS)
    resume_mentions = any(term in resume_text.lower() for term in EDUCATION_TERMS)
    if job_mentions and resume_mentions:
        return 10.0
    if job_mentions and not resume_mentions:
        return 3.0
    return 8.0 if resume_mentions else 6.0


def score_structure(text: str) -> float:
    lowered = text.lower()
    sections = sum(1 for heading in SECTION_HEADINGS if heading in lowered)
    bullets = lowered.count('•') + lowered.count('- ')
    return round(min(10.0, (sections * 2.0) + min(3.0, bullets * 0.2)), 1)


def score_formatting(text: str) -> float:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return 0.0
    readable_lines = sum(1 for line in lines if len(line) < 140)
    readability = readable_lines / len(lines)
    return round(5.0 * min(1.0, 0.5 + readability / 2), 1)


def build_fallback_insight(
    resume_text: str,
    job_description: str,
    matched_keywords: list[str],
    missing_keywords: list[str],
    target_role: str | None,
) -> dict[str, object]:
    role_label = target_role or 'the target role'
    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)
    return {
        'resume_summary': f'The resume is relevant for {role_label.lower()} work and can be improved with stronger keyword alignment.',
        'strengths': [
            'The resume includes recognizable skill and experience signals.' if matched_keywords else 'The resume is readable and structured enough for ATS analysis.',
            'It provides a workable foundation for targeted ATS optimization.',
        ],
        'weaknesses': [
            'Some high-value keywords from the job description are still missing.',
            'Quantified accomplishments and role-specific framing can be stronger.',
        ],
        'missing_keywords': missing_keywords,
        'matched_keywords': matched_keywords,
        'skills_identified': resume_keywords[:20],
        'ats_optimization_suggestions': [
            'Move the strongest matching keywords into the summary and experience sections.',
            'Use metrics and scope to make accomplishments easier for ATS and recruiters to rank.',
            'Keep headings standard and avoid graphics or text boxes that can confuse parsing.',
        ],
        'resume_rewrite_suggestions': [
            f'Customize the opening summary for {role_label}.',
            'Rewrite bullets with action, impact, and measurable results.',
            'Lead each section with the most relevant technologies and outcomes.',
        ],
        'cover_letter_suggestions': [
            f'Connect your background directly to {role_label} requirements.',
            'Close with a concise value proposition and a clear interview ask.',
        ],
        'interview_questions': {
            'hr': [
                f'What makes you a strong fit for a {role_label} role?',
                'Why are you interested in this opportunity right now?',
            ],
            'technical': [
                'What is the most technically challenging project on your resume?',
                'How do you measure the success of the systems you build?',
            ],
            'behavioral': [
                'Tell me about a time you had to influence stakeholders.',
                'Describe a situation where you had to learn quickly to deliver.',
            ],
        },
        'semantic_context': job_keywords[:12],
    }


def analyze_resume_text(resume_text: str, job_description: str, target_role: str | None = None) -> dict[str, object]:
    clean_resume = clean_extracted_text(resume_text)
    clean_job = clean_extracted_text(job_description)

    keyword_score, matched_keywords, missing_keywords = score_keyword_match(clean_resume, clean_job)
    skills_score, matched_skills = score_skills(clean_resume, clean_job)
    experience_score = score_experience(clean_job, clean_resume, target_role)
    education_score = score_education(clean_job, clean_resume)
    structure_score = score_structure(clean_resume)
    formatting_score = score_formatting(clean_resume)

    weighted_total = round(
        (keyword_score * 0.30)
        + skills_score
        + experience_score
        + education_score
        + structure_score
        + formatting_score,
        1,
    )

    insights = build_fallback_insight(clean_resume, clean_job, matched_keywords, missing_keywords, target_role)
    return {
        'ats_score': min(100.0, weighted_total),
        'keyword_score': keyword_score,
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'skills_identified': matched_skills,
        'score_breakdown': {
            'keyword_match': round(keyword_score * 0.30, 1),
            'skills_match': skills_score,
            'experience_relevance': experience_score,
            'education_match': education_score,
            'resume_structure': structure_score,
            'formatting_quality': formatting_score,
        },
        'analysis_json': insights,
    }