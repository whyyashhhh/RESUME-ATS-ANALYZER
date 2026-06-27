import {motion} from "framer-motion";
import {UploadCloud} from "lucide-react";


export default function UploadCard(){


return(

<motion.div

initial={{opacity:0,scale:.9}}

animate={{opacity:1,scale:1}}

transition={{delay:.5}}

className="
max-w-xl
mx-auto
mt-16
p-10
rounded-3xl
bg-white/5
border
border-white/10
text-center
"

>


<UploadCloud

size={50}

className="
mx-auto
text-red-400
mb-6
"

/>



<h2 className="text-3xl font-bold">

Upload Resume

</h2>



<p className="text-white/60 mt-3">

AI will analyze your resume and give ATS score.

</p>



<button

className="
mt-8
px-8
py-3
rounded-xl
bg-red-400
text-black
font-bold
"

>

Choose PDF

</button>



</motion.div>


)

}
