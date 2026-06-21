from app.services.chat_service import get_session
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
    session_id: str = Query(...),
    target_role: str | None = Query(default=None, max_length=120),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ResumeUploadResponse:

    try:
        saved_path, extracted_text, cleaned_text = process_uploaded_file(file)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        ) from exc

    session = get_session(session_id)
    session.resume_text = cleaned_text

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

    return ResumeUploadResponse(
        message='Resume uploaded successfully',
        resume=ResumeRead.model_validate(resume)
    )