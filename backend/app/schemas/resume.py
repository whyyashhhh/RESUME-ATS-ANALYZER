from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    file_name: str
    file_path: str
    file_type: str
    target_role: str | None
    upload_date: datetime


class ResumeUploadResponse(BaseModel):
    message: str
    resume: ResumeRead