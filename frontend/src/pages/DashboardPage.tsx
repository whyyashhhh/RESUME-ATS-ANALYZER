import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {UploadCloud, FileText, Sparkles} from "lucide-react";

import {HeroSection} from "../components/ui/hero-section-shadcnui";
import AICopilot from "../components/AICopilot";
import {api} from "../lib/api";


export function DashboardPage(){


const navigate = useNavigate();


const [file,setFile]=useState<File|null>(null);

const [role,setRole]=useState("");

const [jd,setJd]=useState("");

const [loading,setLoading]=useState(false);




async function analyze(){


if(!file || !role || !jd){

alert("Please add role, job description and resume");

return;

}


try{


setLoading(true);



const sessionId = crypto.randomUUID();



localStorage.setItem(
"resume_session",
sessionId
);



const form = new FormData();

form.append(
"file",
file
);




const upload = await api.post(

`/upload-resume?session_id=${sessionId}&target_role=${role}`,

form

);



const resumeId =
upload.data.resume.id;




const analysis = await api.post(

"/analyze-resume",

{

resume_id:resumeId,

job_description:jd,

target_role:role

}

);



navigate(

`/analysis/${analysis.data.id}`

);



}

catch(err:any){


console.log(
err.response?.data
);


alert("Analysis failed");


}

finally{


setLoading(false);


}


}





return(


<div className="
min-h-screen
bg-[#080808]
text-white
">


<HeroSection/>




<section className="
max-w-5xl
mx-auto
px-6
pb-20
">



<motion.div

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

className="
rounded-3xl
border
border-white/10
bg-white/5
p-10
backdrop-blur-xl
"


>


<div className="
w-20
h-20
rounded-3xl
mx-auto
bg-gradient-to-br
from-blue-500
to-red-500
flex
items-center
justify-center
">


<UploadCloud size={40}/>


</div>





<h2 className="
mt-8
text-4xl
font-black
text-center
">

AI Resume Analyzer

</h2>




<p className="
mt-3
text-center
text-white/50
">

Add role, JD and analyze your resume with AI.

</p>





<input

className="
mt-8
w-full
bg-black/40
border
border-white/20
rounded-xl
px-5
py-4
outline-none
"

placeholder="Target Role"

value={role}

onChange={(e)=>setRole(e.target.value)}

/>





<textarea

className="
mt-5
w-full
h-40
bg-black/40
border
border-white/20
rounded-xl
px-5
py-4
outline-none
"

placeholder="Paste Job Description"

value={jd}

onChange={(e)=>setJd(e.target.value)}

 />







<label className="
mt-6
block
h-32
rounded-3xl
border
border-dashed
border-white/20
bg-black/30
flex
flex-col
items-center
justify-center
cursor-pointer
hover:border-blue-400
transition
">


<FileText

className="text-blue-400"

size={35}

/>



<p className="mt-3 font-semibold">

{

file

?

file.name

:

"Choose Resume PDF"

}

</p>



<input

hidden

type="file"

accept=".pdf"

onChange={(e)=>

setFile(
e.target.files?.[0] || null
)

}

/>



</label>







<motion.button

whileHover={{
scale:1.05
}}

whileTap={{
scale:.95
}}

onClick={analyze}

className="
mt-8
mx-auto
px-12
py-4
rounded-full
font-bold
bg-gradient-to-r
from-blue-500
via-purple-500
to-red-500
flex
gap-2
items-center
"

>



<Sparkles size={18}/>


{

loading

?

"Analyzing..."

:

"Analyze Resume"

}



</motion.button>




</motion.div>





<AICopilot/>





</section>





</div>


)


}
