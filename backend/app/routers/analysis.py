import json

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import (
    AnalyzeResumeRequest,
    AnalysisRead,
    GenerateCoverLetterRequest,
    GenerateInterviewQuestionsRequest,
)
from app.services.analysis_service import analyze_resume_text
from app.utils.security import get_current_user

router = APIRouter()


def to_analysis_read(analysis: Analysis) -> AnalysisRead:
    return AnalysisRead.model_validate(analysis)


@router.post('/analyze-resume', response_model=AnalysisRead, status_code=status.HTTP_201_CREATED)
def analyze_resume(
    payload: AnalyzeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalysisRead:
    resume = db.get(Resume, payload.resume_id)
    if resume is None or resume.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Resume not found')

    analysis_result = analyze_resume_text(resume.extracted_text, payload.job_description, payload.target_role or resume.target_role)
    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        target_role=payload.target_role or resume.target_role,
        job_description=payload.job_description,
        ats_score=analysis_result['ats_score'],
        keyword_score=analysis_result['keyword_score'],
        analysis_json={
            'matched_keywords': analysis_result['matched_keywords'],
            'missing_keywords': analysis_result['missing_keywords'],
            'skills_identified': analysis_result['skills_identified'],
            'score_breakdown': analysis_result['score_breakdown'],
            'insights': analysis_result['analysis_json'],
        },
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return to_analysis_read(analysis)


@router.get('/analysis/{analysis_id}', response_model=AnalysisRead)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalysisRead:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None or analysis.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Analysis not found')
    return to_analysis_read(analysis)


@router.delete('/analysis/{analysis_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None or analysis.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Analysis not found')
    db.delete(analysis)
    db.commit()


@router.get('/analysis/{analysis_id}/download')
def download_analysis_report(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    analysis = db.get(Analysis, analysis_id)
    if analysis is None or analysis.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Analysis not found')

    payload = {
        'analysis': AnalysisRead.model_validate(analysis).model_dump(mode='json'),
        'report': analysis.analysis_json,
    }
    filename = f'analysis-{analysis.id}-report.json'
    return Response(
        content=json.dumps(payload, indent=2, default=str),
        media_type='application/json',
        headers={'Content-Disposition': f'attachment; filename="{filename}"'},
    )


@router.post('/generate-cover-letter')
def generate_cover_letter(
    payload: GenerateCoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    resume = db.get(Resume, payload.resume_id)
    if resume is None or resume.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Resume not found')

    analysis_result = analyze_resume_text(resume.extracted_text, payload.job_description, payload.target_role or resume.target_role)
    insights = analysis_result['analysis_json']
    return {
        'cover_letter': {
            'target_role': payload.target_role or resume.target_role,
            'outline': insights['cover_letter_suggestions'],
            'summary': insights['resume_summary'],
            'matched_keywords': analysis_result['matched_keywords'],
        }
    }


@router.post('/generate-interview-questions')
def generate_interview_questions(
    payload: GenerateInterviewQuestionsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    resume = db.get(Resume, payload.resume_id)
    if resume is None or resume.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Resume not found')

    analysis_result = analyze_resume_text(resume.extracted_text, resume.extracted_text, payload.target_role or resume.target_role)
    insights = analysis_result['analysis_json']
    return {
        'interview_questions': insights['interview_questions'],
        'skills_identified': insights['skills_identified'],
        'target_role': payload.target_role or resume.target_role,
    }