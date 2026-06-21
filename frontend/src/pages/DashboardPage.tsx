import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { api } from '../lib/api';



export function DashboardPage() {


const navigate = useNavigate();



const sessionId =
localStorage.getItem("chat_session") ||
(Date.now().toString());



localStorage.setItem(
"chat_session",
sessionId
);





const [chatFile,setChatFile] =
useState<File | null>(null);



const [resumeId,setResumeId] =
useState<number | null>(null);



const [targetRole,setTargetRole] =
useState("Software Engineer");



const [message,setMessage] =
useState("");



const [loading,setLoading] =
useState(false);



const [error,setError] =
useState("");



const [chat,setChat] =
useState<any[]>([

{
role:"ai",
text:
"Hi 👋 Upload your resume first. I will analyze it with your job description."
}

]);






const logout=()=>{

localStorage.clear();

navigate("/login");

};








// STEP 1 - Upload resume

const uploadResume = async()=>{


if(!chatFile){

setError(
"Please upload resume"
);

return;

}




try{


setLoading(true);



const formData =
new FormData();



formData.append(
"file",
chatFile
);





const response =
await api.post(

"/upload-resume",

formData,

{

params:{

session_id:sessionId,

target_role:targetRole

},


headers:{

"Content-Type":
"multipart/form-data"

}

}

);





setResumeId(
response.data.resume.id
);





setChat(prev=>[

...prev,


{
role:"user",
text:"Resume uploaded 📄"
},


{
role:"ai",
text:
"Resume received ✅ Now paste your job description."
}

]);


}

catch(err:any){


console.log(
err?.response?.data
);


setError(
"Resume upload failed"
);


}

finally{


setLoading(false);


}



};











// STEP 2 - JD + Analysis

const sendMessage = async()=>{


if(!message.trim())
return;



if(!resumeId){


setChat(prev=>[

...prev,


{
role:"ai",
text:
"Please upload resume first 📄"
}

]);


return;

}




const jd = message;



setChat(prev=>[

...prev,


{
role:"user",
text:jd
},


{
role:"ai",
text:
"Analyzing your resume... ⏳"
}


]);



setMessage("");





try{


const response =
await api.post(

"/analyze-resume",

{

resume_id:resumeId,

job_description:jd,

target_role:targetRole

}

);






setChat(prev=>[

...prev,


{
role:"ai",
text:
"Analysis completed ✅ Opening report..."
}

]);





setTimeout(()=>{


navigate(
`/analysis/${response.data.id}`
);


},1000);




}

catch(err:any){


console.log(
"ANALYSIS ERROR",
err?.response?.data
);



setChat(prev=>[

...prev,


{
role:"ai",
text:
"Analysis failed ❌"
}

]);


}



};









return (


<main className="
page-enter
min-h-screen
bg-black
text-white
grid
lg:grid-cols-[280px_1fr]
gap-6
p-6
">



<Sidebar onLogout={logout}/>





<section className="space-y-6">





<header className="
animate-item
border
border-[#262626]
bg-[#0d0d0d]
p-8
">


<p className="
text-xs
tracking-[2px]
text-gray-500
">

AI RESUME COPILOT

</p>


<h1 className="
text-5xl
font-bold
uppercase
mt-4
">

Resume Intelligence

</h1>


</header>









<section className="
animate-item
border
border-[#262626]
bg-[#0d0d0d]
p-8
">



<h2 className="
text-2xl
font-bold
uppercase
">

AI CHAT ASSISTANT

</h2>




<label className="
inline-block
mt-5
border
border-[#262626]
px-5
py-3
cursor-pointer
uppercase
text-sm
">


Upload Resume


<input

hidden

type="file"

accept=".pdf,.docx"

onChange={
e=>
setChatFile(
e.target.files?.[0] || null
)
}


/>


</label>




<button

className="primary-button mt-5"

onClick={uploadResume}

disabled={loading}

>

UPLOAD


</button>






<div className="
mt-8
space-y-4
">


{

chat.map((item,index)=>(


<div

key={index}

className={
item.role==="ai"
?
"chat-ai"
:
"chat-user"
}

>

{item.text}

</div>


))

}


</div>







<input

className="field mt-6"

placeholder="Paste Job Description..."

value={message}

onChange={
e=>setMessage(e.target.value)
}


/>





<button

className="primary-button mt-4"

onClick={sendMessage}

disabled={loading}

>

SEND


</button>





{

error &&

<p className="text-red-400 mt-4">

{error}

</p>

}



</section>




</section>


</main>


);


}