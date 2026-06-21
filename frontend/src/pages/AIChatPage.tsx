import { useState } from "react";
import { api } from "../lib/api";

export default function AIChatPage(){

const [message,setMessage]=useState("");
const [chat,setChat]=useState<any[]>([]);

const session_id="test123";


async function sendMessage(){

const res = await api.post("/chat",{
    session_id,
    message
});


setChat([
 ...chat,
 {
  role:"user",
  text:message
 },
 {
  role:"ai",
  text:res.data.response
 }
]);

setMessage("");

}


return (

<div style={{padding:30}}>

<h1>AI Resume Copilot 🤖</h1>


<div>

{chat.map((c,i)=>(

<div key={i}>

<b>
{c.role==="user"?"You":"AI"}
</b>

<p>{c.text}</p>

</div>

))}

</div>


<input

value={message}

onChange={(e)=>setMessage(e.target.value)}

placeholder="Ask AI..."

style={{
width:"70%",
padding:10
}}

/>


<button onClick={sendMessage}>
Send
</button>


</div>

)

}