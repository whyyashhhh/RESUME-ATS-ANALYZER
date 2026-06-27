import {motion} from "framer-motion";
import {ArrowRight, Sparkles} from "lucide-react";
import {useNavigate} from "react-router-dom";


export function HeroSection(){


const navigate = useNavigate();



return (

<div className="
min-h-screen
bg-[#080808]
text-white
">


<nav className="
h-20
flex
items-center
justify-between
px-10
border-b
border-white/10
">


<h2 className="
font-bold
text-xl
">

AI Resume Analyzer

</h2>




<div className="
flex
gap-6
items-center
text-sm
text-white/70
">


<button

onClick={()=>navigate("/dashboard")}

>

Dashboard

</button>


<button

onClick={()=>navigate("/history")}

>

History

</button>


<button

onClick={()=>navigate("/analysis/1")}

>

Analysis

</button>



</div>


</nav>





<motion.main

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:0.8
}}

className="
flex
flex-col
items-center
justify-center
text-center
px-6
pt-32
"

>


<div className="
flex
items-center
gap-2
border
border-white/20
bg-white/5
rounded-full
px-5
py-2
text-sm
">

<Sparkles size={16}/>

AI Powered Resume Intelligence

</div>





<h1 className="
mt-8
text-6xl
md:text-8xl
font-light
leading-tight
">


Analyze Your

<br/>


<span className="
font-bold
bg-gradient-to-r
from-blue-400
via-purple-400
to-red-500
bg-clip-text
text-transparent
">

Career With AI

</span>


</h1>





<p className="
mt-8
max-w-2xl
text-lg
text-white/60
">

Upload your resume, get ATS score,
find missing skills, generate insights and
prepare for interviews.

</p>






<div className="
mt-10
flex
gap-5
">


<button

onClick={()=>{

document
.getElementById("upload")
?.scrollIntoView({

behavior:"smooth"

})

}}

className="
bg-white
text-black
px-8
py-4
rounded-full
font-bold
flex
items-center
gap-2
hover:scale-105
transition
"

>


Analyze Resume

<ArrowRight size={18}/>


</button>




<button

onClick={()=>navigate("/history")}

className="
border
border-white/20
bg-white/5
px-8
py-4
rounded-full
hover:bg-white/10
transition
"

>


View Reports


</button>



</div>





<div className="
mt-20
grid
grid-cols-3
gap-12
text-center
">


<div>

<h3 className="
text-4xl
font-bold
">

AI

</h3>

<p className="text-white/50">

Analysis

</p>

</div>




<div>

<h3 className="
text-4xl
font-bold
">

ATS

</h3>

<p className="text-white/50">

Score

</p>

</div>




<div>

<h3 className="
text-4xl
font-bold
">

24/7

</h3>

<p className="text-white/50">

Assistant

</p>

</div>



</div>





</motion.main>



</div>


)

}
