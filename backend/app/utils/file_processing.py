from pathlib import Path
import re


def clean_extracted_text(text: str) -> str:
    normalized = re.sub(r'\s+', ' ', text)
    normalized = re.sub(r'[^\w\s.,;:()\-+/&@#%]', ' ', normalized)
    return re.sub(r'\s+', ' ', normalized).strip()


def extract_pdf_text(file_path: Path) -> str:
    from PyPDF2 import PdfReader

    reader = PdfReader(str(file_path))
    return '\n'.join(page.extract_text() or '' for page in reader.pages)


def extract_docx_text(file_path: Path) -> str:
    from docx import Document

    document = Document(str(file_path))
    return '\n'.join(paragraph.text for paragraph in document.paragraphs if paragraph.text.strip())


def extract_text_from_file(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    if suffix == '.pdf':
        return extract_pdf_text(file_path)
    if suffix == '.docx':
        return extract_docx_text(file_path)
    raise ValueError(f'Unsupported file type: {suffix}')