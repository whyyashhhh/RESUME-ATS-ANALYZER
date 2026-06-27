"use client";


import {motion} from "framer-motion";


export default function BackgroundFX(){


return(


<div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">


{/* dots */}

<div className="absolute inset-0

bg-[radial-gradient(#ffffff18_1px,transparent_1px)]

[background-size:32px_32px]

"/>





{/* red glow */}

<motion.div


animate={{

x:[0,100,0],

y:[0,-50,0],

}}



transition={{

duration:15,

repeat:Infinity,

ease:"linear"

}}



className="

absolute

top-20

left-1/3

w-96

h-96

bg-red-600/20

blur-[120px]

rounded-full

"

/>





<motion.div


animate={{

x:[0,-80,0],

y:[0,80,0]

}}



transition={{

duration:18,

repeat:Infinity,

ease:"linear"

}}



className="

absolute

bottom-20

right-20

w-72

h-72

bg-red-500/20

blur-[100px]

rounded-full

"


/>



</div>


)

}
