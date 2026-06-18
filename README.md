<<<<<<< HEAD
# AI Resume Analyzer & ATS Optimizer

Full-stack starter for a production-grade resume analysis platform.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- AI: Gemini-ready analysis layer, LangChain/RAG scaffolding, ChromaDB persistence hooks, Sentence Transformers-ready service boundaries
- File processing: PyPDF2, python-docx
- Security: JWT, bcrypt, validation, file constraints
- Deployment: Docker, Docker Compose, environment variables

## Structure

- [frontend/](frontend) React app
- [backend/](backend) FastAPI service
- [docker-compose.yml](docker-compose.yml) local orchestration
- [.env.example](.env.example) shared environment template

## Run locally

1. Copy [.env.example](.env.example) to `.env` and fill in secrets.
2. Start the full stack with `docker compose up --build`.
3. Open the frontend at `http://localhost:5173` and the backend health check at `http://localhost:8000/health`.

## Deploy On Render

1. Push this repository to GitHub.
2. Create a new Render Blueprint using [render.yaml](render.yaml).
3. Set `JWT_SECRET_KEY` and `GEMINI_API_KEY` as secret environment variables.
4. Use the automatically provisioned Postgres database for production.
5. Open the frontend service URL and verify login, upload, and analysis.

## Production Notes

- The frontend is served by Nginx in production through [frontend/Dockerfile](frontend/Dockerfile).
- The backend reads `DATABASE_URL`, `CORS_ORIGINS`, and file storage paths from environment variables.
- Render provisions the Postgres database and injects the connection string automatically in the blueprint.

## Database

- Create the initial schema with `cd backend && alembic upgrade head`.
- The app also creates tables on startup for local development, but migrations are the preferred path.

## Tests

- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm run build`

## Backend API

- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/upload-resume`
- `POST /api/analyze-resume`
- `GET /api/analysis-history`
- `GET /api/analysis/{id}`
- `DELETE /api/analysis/{id}`

## Notes

- The analysis engine uses deterministic scoring and optional Gemini enrichment.
- RAG persistence is scaffolded through a lightweight in-memory service boundary.
- Uploaded files are stored under the directory configured by `UPLOAD_DIR`.

## Current status

This repository is now bootstrapped as a working starter with backend routes, frontend flows, Docker support, and a polished UI shell.
=======
# RESUME-ATS-ANALYZER
>>>>>>> d50136c45b30106ff91e91f2914e45bb2ced952c
