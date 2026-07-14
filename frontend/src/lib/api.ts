import axios from "axios";


const envBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
const isLocalHost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const defaultBaseUrl = isLocalHost ? "http://localhost:8000/api" : "/api";


export const api = axios.create({

  baseURL: envBaseUrl || defaultBaseUrl,

  withCredentials: false,

});


api.interceptors.request.use((config)=>{


const token = localStorage.getItem("access_token");


if(token){

config.headers.Authorization =
`Bearer ${token}`;

}


return config;


});



api.interceptors.response.use(

(response)=>response,


(error)=>{


if(error.response?.status === 401){


localStorage.removeItem("access_token");

localStorage.removeItem("user_name");

localStorage.removeItem("user_email");


}


return Promise.reject(error);


}

);
