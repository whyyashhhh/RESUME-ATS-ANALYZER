from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AnalyzeResumeRequest(BaseModel):
    resume_id: int
    job_description: str = Field(min_length=20)
    target_role: str | None = Field(default=None, max_length=120)


class GenerateCoverLetterRequest(BaseModel):
    resume_id: int
    job_description: str = Field(min_length=20)
    target_role: str | None = Field(default=None, max_length=120)


class GenerateInterviewQuestionsRequest(BaseModel):
    resume_id: int
    target_role: str | None = Field(default=None, max_length=120)


class AnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    resume_id: int
    target_role: str | None
    ats_score: float
    keyword_score: float
    analysis_json: dict[str, Any]
    created_at: datetime


class AnalysisHistoryItem(BaseModel):
    id: int
    resume_id: int
    file_name: str
    target_role: str | None
    ats_score: float
    keyword_score: float
    created_at: datetime


class AnalysisHistoryResponse(BaseModel):
    items: list[AnalysisHistoryItem]
    total: int