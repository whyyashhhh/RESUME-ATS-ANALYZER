import {useState,useEffect} from "react";
import {motion} from "framer-motion";
import {Bot,Send,UploadCloud} from "lucide-react";
import {api} from "../lib/api";
import {useNavigate} from "react-router-dom";


export default function AICopilot(){

const navigate = useNavigate();


const [message,setMessage]=useState("");

const [chat,setChat]=useState<any[]>([]);

const [file,setFile]=useState<File|null>(null);


const [role,setRole]=useState("");

const [jd,setJd]=useState("");

const [step,setStep]=useState("role");



const session_id =
localStorage.getItem("resume_session")
||
crypto.randomUUID();



useEffect(()=>{


localStorage.setItem(
"resume_session",
session_id
);


setChat([

{
role:"ai",
text:
"Hi 👋 Welcome to AI Resume Copilot.\n\nPlease tell me your target job role."
}

]);


},[]);






async function sendMessage(){


if(!message.trim())return;



setChat(prev=>[

...prev,

{
role:"user",
text:message
}

]);




if(step==="role"){


setRole(message);

setStep("jd");


setChat(prev=>[

...prev,

{

role:"ai",

text:
"Great 🚀 Now paste your Job Description."

}

]);

}



else if(step==="jd"){


setJd(message);

setStep("resume");



setChat(prev=>[

...prev,

{

role:"ai",

text:
"Perfect ✅ Now upload your resume PDF."

}

]);

}



setMessage("");



}







async function uploadResume(){


if(!file){

alert("Please upload resume");

return;

}



try{


const form=new FormData();

form.append(
"file",
file
);




const upload=await api.post(

`/upload-resume?session_id=${session_id}&target_role=${role}`,

form

);




const analysis=await api.post(

"/analyze-resume",

{

resume_id:upload.data.resume.id,

job_description:jd,

target_role:role

}

);



navigate(

`/analysis/${analysis.data.id}`

);



}

catch(err){

console.log(err);

alert("Upload failed");

}


}






return(


<motion.div

initial={{opacity:0,y:30}}

animate={{opacity:1,y:0}}

className="
mt-12
rounded-3xl
border
border-white/10
bg-white/5
p-10
backdrop-blur-xl
"

>


<h2 className="
text-4xl
font-black
flex
items-center
gap-3
">


<Bot/>

AI Resume Copilot


</h2>




<div className="
mt-8
h-96
overflow-y-auto
space-y-4
">


{

chat.map((c,i)=>(


<div

key={i}

className={

c.role==="user"

?

"ml-auto max-w-md bg-blue-500/20 p-4 rounded-2xl"

:

"max-w-md bg-white/10 p-4 rounded-2xl"

}

>


<b>

{

c.role==="user"

?

"You"

:

"AI"

}

</b>



<p className="
mt-2
whitespace-pre-line
text-white/70
">

{c.text}

</p>


</div>


))

}



</div>







<div className="
mt-6
flex
gap-4
">


<input

value={message}

onChange={(e)=>setMessage(e.target.value)}

placeholder="Type message..."

className="
flex-1
bg-black/40
border
border-white/20
rounded-full
px-6
py-3
"

/>



<button

onClick={sendMessage}

className="
px-8
rounded-full
bg-gradient-to-r
from-blue-500
to-red-500
"

>

<Send/>


</button>


</div>







{

step==="resume"

&&


<div className="
mt-6
flex
gap-5
items-center
">


<label

className="
cursor-pointer
px-6
py-3
rounded-full
bg-white/10
border
border-white/20
"

>


<UploadCloud size={18}/>



{

file

?

file.name

:

"Upload Resume PDF"

}



<input

hidden

type="file"

accept=".pdf"

onChange={(e)=>{

setFile(
e.target.files?.[0] || null
)

}}


/>


</label>





<button

onClick={uploadResume}

className="
px-8
py-3
rounded-full
bg-gradient-to-r
from-purple-500
to-red-500
font-bold
"

>

Analyze Resume 🚀


</button>


</div>


}



</motion.div>


)

}
