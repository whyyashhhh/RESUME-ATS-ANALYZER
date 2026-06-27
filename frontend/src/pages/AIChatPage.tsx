import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {Bot,Send,UploadCloud,Sparkles} from "lucide-react";
import {api} from "../lib/api";


export default function AIChatPage(){


const navigate = useNavigate();


const [message,setMessage]=useState("");

const [file,setFile]=useState<File|null>(null);

const [chat,setChat]=useState<any[]>([]);


const [role,setRole]=useState("");

const [jd,setJd]=useState("");



const session_id =
localStorage.getItem("resume_session")
||
crypto.randomUUID();



localStorage.setItem(
"resume_session",
session_id
);




async function send(){


if(!message)return;



const res = await api.post(

"/chat",

{

session_id,

message

}

);



setChat(prev=>[

...prev,

{
role:"user",
text:message
},

{
role:"ai",
text:res.data.response
}

]);



setMessage("");

}



async function uploadResume(){


if(!file)return;


const form=new FormData();

form.append(
"file",
file
);



await api.post(

`/upload-resume?session_id=${session_id}&target_role=${role}`,

form

);



setChat(prev=>[

...prev,

{

role:"ai",

text:"Resume uploaded ? Ready for analysis."

}

]);



}





async function generateAnalysis(){



const res = await api.post(

"/analyze-resume",

{

resume_id:1,

job_description:jd,

target_role:role

}

);



navigate(

`/analysis/${res.data.id}`

);


}





return(


<div className="
min-h-screen
bg-[#080808]
text-white
px-6
py-20
">


<motion.div

className="
max-w-5xl
mx-auto
"

initial={{opacity:0}}

animate={{opacity:1}}

>



<h1 className="
text-6xl
font-black
bg-gradient-to-r
from-blue-400
to-red-500
bg-clip-text
text-transparent
">

AI Resume Copilot

</h1>




<input

className="
mt-8
w-full
bg-white/10
rounded-xl
p-4
"

placeholder="Target Role"

value={role}

onChange={e=>setRole(e.target.value)}

/>





<textarea

className="
mt-4
w-full
h-32
bg-white/10
rounded-xl
p-4
"

placeholder="Job Description"

value={jd}

onChange={e=>setJd(e.target.value)}

/>






<div className="
mt-10
bg-white/5
border
border-white/10
rounded-3xl
p-8
space-y-5
">


{

chat.map((c,i)=>(

<div

key={i}

className="
bg-white/10
rounded-xl
p-4
"

>


<b>

{c.role==="user"?"You":"AI"}

</b>


<p>

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

onChange={e=>setMessage(e.target.value)}

placeholder="Chat with AI..."

className="
flex-1
bg-white/10
rounded-full
px-6
"

/>



<button

onClick={send}

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






<div className="
mt-6
flex
gap-5
items-center
">


<input

type="file"

accept=".pdf"

onChange={e=>

setFile(e.target.files?.[0]||null)

}

/>



<button

onClick={uploadResume}

className="
px-6
py-3
rounded-full
bg-white/10
"

>


<UploadCloud/>

Upload


</button>



<button

onClick={generateAnalysis}

className="
px-8
py-3
rounded-full
bg-gradient-to-r
from-purple-500
to-red-500
font-bold
flex
gap-2
"

>


<Sparkles/>

Generate Analysis


</button>




</div>






</motion.div>


</div>


)

}
