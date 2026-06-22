from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.rate_limit import RateLimitMiddleware

from app.database.base import Base
from app.database.session import engine

from app import models  # noqa: F401

from app.routers import analysis, auth, resume, chat


@asynccontextmanager
async def lifespan(app: FastAPI):

    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan
)


# Rate limit

app.add_middleware(

    RateLimitMiddleware,

    limits={

        "/api/register": (5, 60),

        "/api/login": (10, 60),

        "/api/upload-resume": (10, 60),

    },

)


# CORS FIX

app.add_middleware(

    CORSMiddleware,

    allow_origins=settings.cors_origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)



# Routers

app.include_router(

    auth.router,

    prefix="/api",

    tags=["auth"]

)


app.include_router(

    resume.router,

    prefix="/api",

    tags=["resume"]

)


app.include_router(

    analysis.router,

    prefix="/api",

    tags=["analysis"]

)


app.include_router(

    chat.router,

    prefix="/api",

    tags=["chat"]

)



@app.get("/health")
def health_check():

    return {

        "status": "ok"

    }