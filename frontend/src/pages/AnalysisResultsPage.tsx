import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { api } from '../lib/api';


type AnalysisResponse = {

  id:number;

  ats_score:number;

  keyword_score:number;

  analysis_json:{

    insights?:{

      resume_summary?:string;

      strengths?:string[];

      weaknesses?:string[];

      missing_keywords?:string[];

      ats_optimization_suggestions?:string[];

      cover_letter_suggestions?:string[];

      interview_questions?:Record<string,string[]>;

    };

    score_breakdown?:Record<string,number>;

  };

};




export function AnalysisResultsPage(){


const {id} = useParams();


const [analysis,setAnalysis] =
useState<AnalysisResponse|null>(null);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState('');





useEffect(()=>{


const load = async()=>{


try{


const res =
await api.get(`/analysis/${id}`);


setAnalysis(res.data);


}

catch{


setError(
"Unable to load analysis"
);


}

finally{


setLoading(false);


}


};



load();


},[id]);






if(loading){

return (

<div className="
min-h-screen
bg-black
text-white
p-10
">

Loading analysis...

</div>

);

}






if(error){

return (

<div className="
min-h-screen
bg-black
text-red-400
p-10
">

{error}

</div>

);

}







const insights =
analysis?.analysis_json.insights;



return (

<main className="
page-enter
min-h-screen
bg-black
text-white
p-6
">


<section className="
border
border-[#262626]
bg-[#0d0d0d]
p-8
max-w-7xl
mx-auto
">



<p className="
text-xs
tracking-[2px]
text-gray-500
">

AI ANALYSIS REPORT

</p>



<h1 className="
text-5xl
font-bold
uppercase
mt-5
">

Resume Score

</h1>





<div className="
grid
md:grid-cols-2
gap-6
mt-10
">


<div className="
border
border-[#262626]
p-8
">

<p className="
text-gray-500
uppercase
text-xs
">

ATS SCORE

</p>


<h2 className="
text-6xl
font-bold
mt-4
">

{analysis?.ats_score}

</h2>


</div>





<div className="
border
border-[#262626]
p-8
">

<p className="
text-gray-500
uppercase
text-xs
">

KEYWORD MATCH

</p>


<h2 className="
text-6xl
font-bold
mt-4
">

{analysis?.keyword_score}%

</h2>


</div>


</div>







<div className="
mt-8
grid
gap-6
">



<section className="
border
border-[#262626]
p-6
">


<h2 className="
text-2xl
font-bold
uppercase
">

Summary

</h2>


<p className="
mt-4
text-gray-400
">

{insights?.resume_summary}

</p>


</section>






<section className="
border
border-[#262626]
p-6
">


<h2 className="
text-2xl
font-bold
uppercase
">

Strengths

</h2>



<ul className="
mt-4
space-y-3
">


{

(insights?.strengths ?? []).map(item=>(


<li

key={item}

className="
border
border-[#262626]
p-4
text-gray-300
"

>

{item}

</li>


))

}


</ul>


</section>








<section className="
border
border-[#262626]
p-6
">


<h2 className="
text-2xl
font-bold
uppercase
">

Improvements

</h2>



<ul className="
mt-4
space-y-3
">


{

(insights?.ats_optimization_suggestions ?? []).map(item=>(


<li

key={item}

className="
border
border-[#262626]
p-4
text-gray-300
"

>

{item}

</li>


))

}


</ul>


</section>




</div>





</section>


</main>


);


}