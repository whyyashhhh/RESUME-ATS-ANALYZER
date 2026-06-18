from __future__ import annotations

from io import BytesIO

from app.models import Analysis, Resume, User


def test_health_endpoint(client) -> None:
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_register_login_and_analysis_flow(client, db_session) -> None:
    register_response = client.post(
        '/api/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'testpassword123'},
    )
    assert register_response.status_code in {200, 201}
    token = register_response.json()['access_token']

    login_response = client.post(
        '/api/login',
        json={'email': 'test@example.com', 'password': 'testpassword123'},
    )
    assert login_response.status_code == 200
    assert login_response.json()['access_token']

    headers = {'Authorization': f'Bearer {token}'}
    file_response = client.post(
        '/api/upload-resume',
        headers=headers,
        files={'file': ('resume.txt', BytesIO(b'not supported'), 'text/plain')},
    )
    assert file_response.status_code == 400

    user = db_session.query(User).filter_by(email='test@example.com').first()
    assert user is not None

    resume = Resume(
        user_id=user.id,
        file_name='resume.pdf',
        file_path='resume.pdf',
        file_type='pdf',
        extracted_text='Python FastAPI PostgreSQL Docker',
        target_role='Software Engineer',
    )
    db_session.add(resume)
    db_session.commit()
    db_session.refresh(resume)

    analysis_response = client.post(
        '/api/analyze-resume',
        headers=headers,
        json={
            'resume_id': resume.id,
            'job_description': 'Need Python FastAPI PostgreSQL Docker experience.',
            'target_role': 'Software Engineer',
        },
    )
    assert analysis_response.status_code == 201
    body = analysis_response.json()
    assert body['ats_score'] > 0

    history_response = client.get('/api/analysis-history', headers=headers)
    assert history_response.status_code == 200
    assert history_response.json()['total'] >= 1
