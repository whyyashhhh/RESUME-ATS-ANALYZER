from app.services.gemini_service import client



class ChatSession:

    def __init__(self):

        self.messages=[]

        self.resume_text=None

        self.job_description=None

        self.target_role=None

        self.step="role"



sessions={}





def get_session(session_id:str):

    if session_id not in sessions:

        sessions[session_id]=ChatSession()


    return sessions[session_id]







def handle_chat(session_id:str,user_message:str):


    session=get_session(session_id)



    msg=user_message.strip()



    # STEP 1 ROLE


    if session.step=="role":


        session.target_role=msg


        session.step="jd"



        return {

        "response":
        "Great ?? Now paste the Job Description for this role.",

        "session_id":session_id

        }






    # STEP 2 JD


    if session.step=="jd":


        session.job_description=msg


        session.step="resume"



        return {

        "response":
        "Perfect ? Now upload your resume PDF.",

        "session_id":session_id

        }







    # STEP 3 WAIT RESUME


    if session.step=="resume":


        if not session.resume_text:


            return {


            "response":
            "Please upload your resume first.",

            "session_id":session_id

            }








    # NORMAL AI CHAT


    session.messages.append({

        "role":"user",

        "content":msg

    })





    prompt=f"""

You are an AI Resume Copilot.


Target Role:

{session.target_role}



Job Description:

{session.job_description}



Resume:

{session.resume_text}



Conversation:

{session.messages}



Help the user with:

- ATS improvement
- Resume suggestions
- Interview preparation
- Career advice


"""



    response=client.models.generate_content(

        model="models/gemini-2.5-flash",

        contents=prompt

    )




    ai=response.text



    session.messages.append({

        "role":"assistant",

        "content":ai

    })



    return {


    "response":ai,

    "session_id":session_id


    }
