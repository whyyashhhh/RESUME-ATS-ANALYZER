from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DATABASE_URL', 'sqlite:///./test.db')

from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.models import Analysis, Resume, User  # noqa: F401
from app.utils.security import get_current_user, hash_password


@pytest.fixture()
def db_session() -> Session:
    engine = create_engine('sqlite:///./test.db', connect_args={'check_same_thread': False})
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> TestClient:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    def override_current_user():
        user = db_session.query(User).first()
        if user is None:
            user = User(name='Test User', email='test@example.com', password_hash=hash_password('testpassword123'))
            db_session.add(user)
            db_session.commit()
            db_session.refresh(user)
        return user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_current_user
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
