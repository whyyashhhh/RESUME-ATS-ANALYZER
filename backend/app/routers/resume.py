from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.schemas.analysis import AnalysisHistoryItem, AnalysisHistoryResponse
from app.schemas.resume import ResumeRead, ResumeUploadResponse
from app.services.file_service import process_uploaded_file
from app.utils.security import get_current_user

router = APIRouter()


@router.post('/upload-resume', response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    target_role: str | None = Query(default=None, max_length=120),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResumeUploadResponse:
    try:
        saved_path, extracted_text, cleaned_text = process_uploaded_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    resume = Resume(
        user_id=current_user.id,
        file_name=saved_path.name,
        file_path=str(saved_path),
        file_type=saved_path.suffix.lower().lstrip('.'),
        extracted_text=cleaned_text,
        target_role=target_role,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return ResumeUploadResponse(message='Resume uploaded successfully', resume=ResumeRead.model_validate(resume))


@router.get('/analysis-history', response_model=AnalysisHistoryResponse)
def analysis_history(
    q: str | None = Query(default=None, max_length=120),
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalysisHistoryResponse:
    statement = (
        select(Analysis, Resume.file_name)
        .join(Resume, Resume.id == Analysis.resume_id)
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .limit(limit)
    )
    if q:
        search_term = f'%{q.lower()}%'
        statement = statement.where(
            or_(
                Analysis.target_role.ilike(search_term),
                Resume.file_name.ilike(search_term),
            )
        )

    rows = db.execute(statement).all()
    items = [
        AnalysisHistoryItem(
            id=analysis.id,
            resume_id=analysis.resume_id,
            file_name=file_name,
            target_role=analysis.target_role,
            ats_score=analysis.ats_score,
            keyword_score=analysis.keyword_score,
            created_at=analysis.created_at,
        )
        for analysis, file_name in rows
    ]
    return AnalysisHistoryResponse(items=items, total=len(items))