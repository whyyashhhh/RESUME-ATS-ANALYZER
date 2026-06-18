from pathlib import Path
import shutil

from fastapi import UploadFile

from app.core.config import settings
from app.utils.file_processing import clean_extracted_text, extract_text_from_file

ALLOWED_SUFFIXES = {'.pdf', '.docx'}


def validate_upload_file(upload_file: UploadFile) -> None:
    suffix = Path(upload_file.filename or '').suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise ValueError('Only PDF and DOCX files are supported')


def validate_upload_size(upload_file: UploadFile) -> None:
    current_position = upload_file.file.tell()
    upload_file.file.seek(0, 2)
    file_size = upload_file.file.tell()
    upload_file.file.seek(current_position)

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if file_size > max_bytes:
        raise ValueError(f'File exceeds the {settings.max_upload_size_mb} MB limit')


def save_upload_file(upload_file: UploadFile, destination_dir: str | None = None) -> Path:
    validate_upload_file(upload_file)
    validate_upload_size(upload_file)
    target_dir = Path(destination_dir or settings.upload_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    filename = Path(upload_file.filename or 'resume').name
    destination_path = target_dir / filename
    with destination_path.open('wb') as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return destination_path


def process_uploaded_file(upload_file: UploadFile) -> tuple[Path, str, str]:
    saved_path = save_upload_file(upload_file)
    extracted_text = extract_text_from_file(saved_path)
    cleaned_text = clean_extracted_text(extracted_text)
    return saved_path, extracted_text, cleaned_text