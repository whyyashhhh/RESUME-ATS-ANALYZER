import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../lib/api';


export function LoginPage() {

  const navigate = useNavigate();


  const [email,setEmail] = useState('');

  const [password,setPassword] = useState('');

  const [error,setError] = useState('');

  const [loading,setLoading] = useState(false);



  const handleSubmit = async(
    event:React.FormEvent<HTMLFormElement>
  )=>{


    event.preventDefault();

    setError('');

    setLoading(true);



    try{


      const response = await api.post(
        '/login',
        {
          email,
          password
        }
      );



      localStorage.setItem(
        'access_token',
        response.data.access_token
      );


      localStorage.setItem(
        'user_name',
        response.data.user.name
      );


      localStorage.setItem(
        'user_email',
        response.data.user.email
      );



      navigate('/dashboard');


    }

    catch{


      setError(
        'INVALID CREDENTIALS'
      );


    }


    finally{

      setLoading(false);

    }


  };






return (

<main className="
min-h-screen
bg-black
flex
items-center
justify-center
p-6
">



<section className="
w-full
max-w-md
border
border-[#262626]
bg-[#0d0d0d]
p-10
">



<p className="
text-xs
tracking-[2px]
text-gray-500
uppercase
">

AI RESUME SYSTEM

</p>





<h1 className="
mt-6
text-5xl
font-bold
uppercase
text-white
">

SIGN IN

</h1>




<div className="
mt-5
h-[3px]
w-20
bg-gradient-to-r
from-blue-600
via-blue-400
to-red-600
"/>





<p className="
mt-6
text-gray-400
text-sm
leading-6
">

Access your AI powered resume intelligence dashboard.

</p>







<form

onSubmit={handleSubmit}

className="
mt-8
grid
gap-5
"

>



<input

className="field"

type="email"

placeholder="EMAIL ADDRESS"

value={email}

onChange={
e=>setEmail(e.target.value)
}

/>





<input

className="field"

type="password"

placeholder="PASSWORD"

value={password}

onChange={
e=>setPassword(e.target.value)
}

/>






{
error &&

<p className="
text-red-400
text-sm
tracking-wide
">

{error}

</p>

}





<button

className="primary-button"

disabled={loading}

>

{

loading

?

'AUTHENTICATING...'

:

'SIGN IN'

}


</button>





</form>







<p className="
mt-8
text-sm
text-gray-400
">


NEW USER?


<Link

to="/register"

className="
ml-2
text-white
uppercase
tracking-[1px]
"

>

CREATE ACCOUNT

</Link>



</p>






</section>


</main>


);


}