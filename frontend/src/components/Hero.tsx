import {motion} from "framer-motion";


export default function Hero(){


return(


<section className="
relative
max-w-6xl
mx-auto
px-6
pt-28
text-center
overflow-hidden
">


{/* animated glow */}

<motion.div

animate={{

scale:[1,1.2,1],

opacity:[0.4,0.8,0.4]

}}

transition={{

duration:5,

repeat:Infinity

}}

className="

absolute

top-20

left-1/2

-translate-x-1/2

w-96

h-96

bg-red-600/30

blur-[120px]

rounded-full

"


/>





<motion.div


initial={{

opacity:0,

y:50

}}



whileInView={{

opacity:1,

y:0

}}



viewport={{

once:true

}}



transition={{

duration:.8

}}



className="relative z-10"


>



<p className="

text-red-500

tracking-[5px]

uppercase

font-semibold

mb-6

"

>

AI Resume Analyzer

</p>





<h1 className="

text-5xl

md:text-7xl

font-black

leading-tight

"

>


<span className="

relative

">


Analyze Resume


<motion.span


animate={{

opacity:[0.5,1,0.5]

}}



transition={{

duration:3,

repeat:Infinity

}}



className="

absolute

inset-0

blur-2xl

bg-red-500/40

- z-10

"

/>


</span>



<br/>


<span className="text-red-500">

with AI

</span>


</h1>





<p className="

mt-8

text-xl

text-white/60

max-w-2xl

mx-auto

"

>

Get ATS score, AI feedback and improve your resume instantly.

</p>




<button className="

mt-10

px-8

py-3

rounded-xl

bg-red-500

text-white

font-bold

hover:scale-105

transition

"

>

Analyze Resume

</button>



</motion.div>



</section>


)

}
