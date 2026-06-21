import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { api } from '../lib/api';



type HistoryItem = {

id:number;

file_name:string;

target_role:string | null;

ats_score:number;

keyword_score:number;

created_at:string;

};





export function HistoryPage(){


const [items,setItems] = useState<HistoryItem[]>([]);

const [query,setQuery] = useState('');

const [loading,setLoading] = useState(true);

const [error,setError] = useState('');





const logout = ()=>{


localStorage.clear();

window.location.href='/login';


};








useEffect(()=>{


async function loadHistory(){


try{


const res = await api.get(

'/analysis-history',

{

params:

query

?

{

q:query

}

:

undefined

}

);


setItems(
res.data.items
);



}

catch{


setError(
'Unable to load history'
);


}


finally{


setLoading(false);


}



}



setLoading(true);

loadHistory();



},[query]);









return (

<main className="
min-h-screen
bg-black
text-white
grid
lg:grid-cols-[280px_1fr]
gap-6
p-6
">



<Sidebar onLogout={logout}/>





<section className="
space-y-6
">





<header className="
border
border-[#262626]
bg-[#0d0d0d]
p-8
">



<p className="
text-xs
tracking-[2px]
text-gray-500
uppercase
">

ANALYSIS ARCHIVE

</p>




<h1 className="
text-5xl
font-bold
uppercase
mt-5
">

PREVIOUS SCANS

</h1>




<div className="
mt-6
h-[3px]
w-20
bg-gradient-to-r
from-blue-600
to-red-600
"/>





<p className="
mt-6
text-gray-400
max-w-2xl
">

Review previous resume intelligence reports and compare ATS improvements.

</p>





<input

className="
field
mt-8
max-w-xl
"

placeholder="SEARCH ROLE OR FILE"

value={query}

onChange={
e=>setQuery(e.target.value)
}

/>



</header>








{
loading &&

<p className="text-gray-400">

Loading history...

</p>

}





{
error &&

<p className="text-red-400">

{error}

</p>

}








<div className="
grid
gap-5
">





{

items.map(item=>(



<Link

key={item.id}

to={`/analysis/${item.id}`}

className="
border
border-[#262626]
bg-[#0d0d0d]
p-6
grid
gap-6
md:grid-cols-[1fr_auto]
hover:border-white
transition
"


>






<div>


<p className="
text-xs
tracking-[2px]
text-gray-500
uppercase
">

{
item.target_role ||
'NO ROLE'
}

</p>




<h2 className="
text-2xl
font-bold
uppercase
mt-3
">

{item.file_name}

</h2>




<p className="
mt-3
text-gray-500
text-sm
">

{new Date(item.created_at).toLocaleString()}

</p>



</div>








<div className="
flex
gap-4
">


<div className="
border
border-[#262626]
px-6
py-4
text-center
">


<p className="
text-xs
text-gray-500
tracking-widest
">

ATS

</p>


<p className="
text-3xl
font-bold
mt-2
">

{item.ats_score}

</p>


</div>






<div className="
border
border-[#262626]
px-6
py-4
text-center
">


<p className="
text-xs
text-gray-500
tracking-widest
">

KEYWORDS

</p>


<p className="
text-3xl
font-bold
mt-2
">

{item.keyword_score}%

</p>


</div>



</div>





</Link>



))

}



</div>





</section>


</main>


);

}