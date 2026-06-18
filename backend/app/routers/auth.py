from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse, UserCreate, UserLogin, UserRead
from app.utils.security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter()


def to_user_read(user: User) -> UserRead:
    return UserRead.model_validate(user)


@router.post('/register', response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email is already registered')

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id), {'email': user.email})
    return TokenResponse(access_token=token, user=to_user_read(user))


@router.post('/login', response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')

    token = create_access_token(str(user.id), {'email': user.email})
    return TokenResponse(access_token=token, user=to_user_read(user))


@router.get('/me', response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> UserRead:
    return to_user_read(current_user)