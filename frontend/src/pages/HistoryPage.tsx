import {motion} from "framer-motion";


export function HistoryPage(){


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
max-w-5xl
mx-auto
"

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

Resume History

</h1>



<p className="
mt-5
text-white/60
text-lg
">

View your previous AI resume analysis reports.

</p>




<div className="
mt-12
rounded-3xl
border
border-white/10
bg-white/5
backdrop-blur-xl
p-10
">


<h2 className="
text-2xl
font-bold
">

No Reports Yet

</h2>


<p className="
mt-3
text-white/50
">

Upload and analyze your resume to see history here.

</p>


</div>



</motion.div>


</div>


)

}
