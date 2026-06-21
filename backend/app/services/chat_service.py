from app.services.gemini_service import client


class ChatSession:
    def __init__(self):
        self.messages = []
        self.resume_text = None
        self.job_description = None


sessions = {}


def get_session(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = ChatSession()
    return sessions[session_id]


def handle_chat(session_id: str, user_message: str):

    session = get_session(session_id)

    # Resume check
    if not session.resume_text:
        return {
            "response": "Please upload your resume first.",
            "session_id": session_id
        }

    # Save Job Description
    if user_message.lower().startswith("job description:"):

        session.job_description = (
            user_message.replace("Job Description:", "")
            .strip()
        )

        return {
            "response":
            "✅ Job Description saved successfully.\n\n"
            "Now you can ask:\n"
            "- ATS Analysis\n"
            "- Generate Cover Letter\n"
            "- Generate Interview Questions",
            "session_id": session_id
        }

    # ATS Analysis
    if user_message.lower() == "ats analysis":

        if not session.job_description:
            return {
                "response": "Please provide Job Description first.",
                "session_id": session_id
            }

        prompt = f"""
You are an expert ATS Resume Analyzer.

Resume:
{session.resume_text}

Job Description:
{session.job_description}

Provide:

1. ATS Score (0-100)
2. Resume Match Percentage
3. Missing Keywords
4. Strengths
5. Weaknesses
6. Skills to Add
7. Resume Improvements
8. Interview Questions
9. Hiring Recommendation

Format professionally.
"""

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        return {
            "response": response.text,
            "session_id": session_id
        }

    # Cover Letter
    if user_message.lower() == "generate cover letter":

        if not session.job_description:
            return {
                "response": "Please provide Job Description first.",
                "session_id": session_id
            }

        prompt = f"""
Create a professional cover letter.

Resume:
{session.resume_text}

Job Description:
{session.job_description}
"""

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        return {
            "response": response.text,
            "session_id": session_id
        }

    # Interview Questions
    if user_message.lower() == "generate interview questions":

        if not session.job_description:
            return {
                "response": "Please provide Job Description first.",
                "session_id": session_id
            }

        prompt = f"""
Generate 20 interview questions.

Resume:
{session.resume_text}

Job Description:
{session.job_description}

Include:
- Technical Questions
- HR Questions
- Project Questions
- Scenario Based Questions
"""

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        return {
            "response": response.text,
            "session_id": session_id
        }

    # Normal Chat
    session.messages.append({
        "role": "user",
        "content": user_message
    })

    prompt = f"""
You are an AI Resume Copilot.

Resume:
{session.resume_text}

Job Description:
{session.job_description}

Conversation:
{session.messages}

Answer like ChatGPT.
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    ai_text = response.text

    session.messages.append({
        "role": "assistant",
        "content": ai_text
    })

    return {
        "response": ai_text,
        "session_id": session_id
    }