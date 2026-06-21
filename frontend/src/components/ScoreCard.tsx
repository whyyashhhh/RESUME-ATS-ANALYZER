type ScoreCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: 'brand' | 'accent' | 'slate';
};


export function ScoreCard({
  title,
  value,
  subtitle,
}: ScoreCardProps) {


return (

<div
className="
border
border-[#262626]
bg-[#0d0d0d]
p-6
transition
hover:border-white
"
>


<p
className="
text-xs
uppercase
tracking-[2px]
text-gray-500
"
>

{title}

</p>



<div
className="
mt-5
text-5xl
font-bold
text-white
"
>

{value}

</div>




{
subtitle &&

<p
className="
mt-4
text-sm
leading-6
text-gray-400
"
>

{subtitle}

</p>

}



</div>


);


}