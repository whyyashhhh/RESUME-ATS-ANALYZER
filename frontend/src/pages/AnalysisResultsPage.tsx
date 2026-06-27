import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {api} from "../lib/api";


export function AnalysisResultsPage(){


const {id}=useParams();

const [data,setData]=useState<any>(null);



useEffect(()=>{


api.get(`/analysis/${id}`)

.then(res=>{

setData(res.data)

})


},[id]);




if(!data){

return <div className="bg-black min-h-screen text-white p-10">
Loading...
</div>

}




const a=data.analysis_json.insights || data.analysis_json;



const Section=({title,items}:any)=>(

<div className="
bg-white/5
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-3xl
font-bold
mb-5
">

{title}

</h2>


<ul className="
space-y-3
text-white/70
">


{

Array.isArray(items)

?

items.map((x:string,i:number)=>(

<li key={i}>
• {x}
</li>

))

:

Object.values(items || {}).flat().map((x:any,i:number)=>(

<li key={i}>
• {x}
</li>

))

}



</ul>


</div>


);






return(


<div className="
min-h-screen
bg-[#080808]
text-white
px-6
py-20
">


<motion.div

initial={{opacity:0,y:30}}

animate={{opacity:1,y:0}}

className="
max-w-6xl
mx-auto
"


>


<h1 className="
text-6xl
font-black
bg-gradient-to-r
from-blue-400
to-red-500
text-transparent
bg-clip-text
">

AI Resume Analysis

</h1>




<div className="
grid
md:grid-cols-2
gap-6
mt-10
">


<div className="
bg-white/5
rounded-3xl
p-8
border
border-white/10
">


<h2 className="text-5xl font-black">

{data.ats_score}%

</h2>


<p className="text-white/50">
ATS Score
</p>


</div>



<div className="
bg-white/5
rounded-3xl
p-8
border
border-white/10
">


<h2 className="text-5xl font-black">

{data.keyword_score}%

</h2>


<p className="text-white/50">
Keyword Match
</p>


</div>


</div>





<div className="
mt-10
space-y-6
">


<Section

title="Resume Summary"

items={[a.resume_summary]}

/>



<Section

title="Strengths"

items={a.strengths}

/>




<Section

title="Weaknesses"

items={a.weaknesses}

/>



<Section

title="Recommendations"

items={a.ats_optimization_suggestions}

/>



<Section

title="Resume Improvements"

items={a.resume_rewrite_suggestions}

/>



<Section

title="Interview Questions"

items={a.interview_questions}

/>



</div>



</motion.div>


</div>


)

}
