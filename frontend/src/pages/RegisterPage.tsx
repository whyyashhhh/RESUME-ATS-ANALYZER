import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../lib/api';


export function RegisterPage() {


  const navigate = useNavigate();


  const [name,setName] = useState('');

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

        '/register',

        {
          name,
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
        'ACCOUNT CREATION FAILED'
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
bg-[#0d0d0d]
border
border-[#262626]
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
">

CREATE ACCOUNT

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

Create your profile and start optimizing resumes with AI.

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

placeholder="FULL NAME"

value={name}

onChange={
e=>setName(e.target.value)
}

/>






<input

className="field"

placeholder="EMAIL ADDRESS"

type="email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

/>






<input

className="field"

placeholder="PASSWORD"

type="password"

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

'CREATING...'

:

'CREATE ACCOUNT'

}


</button>




</form>







<p className="
mt-8
text-sm
text-gray-400
">


ALREADY REGISTERED?


<Link

to="/login"

className="
ml-2
text-white
uppercase
tracking-[1px]
"

>

SIGN IN

</Link>



</p>





</section>



</main>


);

}