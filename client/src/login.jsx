import {useState} from 'react'
import axios from 'axios'
import './index.css'
import { Navigate } from "react-router-dom";




export default function login({socket,login,  isLoggedIn,setIsLoggedIn,userdata,setUserdata}) {
  const [loadingStatue, setLoadingStatue] = useState('starting');
  const [loadingClass, setLoadingClass] = useState('hidden');

  const [ errStatus, setErrStatus ] = useState([' ', ' ']);

  const handleLogin = (e)=>{
    e.preventDefault()
    setLoadingClass('block')
    const email = e.target.email.value;
    const password = e.target.password.value;
    socket.connect();
    socket.emit('login', { email, password });


    socket.on('loginResponse',  (response, userdataa) => {
      //console.log(response);
      if (response) {
          setUserdata(userdataa);
          //console.log(userdataa);
          setLoadingStatue('LoginSuccess');
      } 
      else {
        setLoadingStatue('starting');
          setIsLoggedIn(false); 
      }
    });

    socket.on('loginStatus', async ({ status,end }) => { 

      console.log(status);   
     
      if (end) { setIsLoggedIn(true); <Navigate to='/dashboard'/> };
      if (!end) {   setLoadingStatue(status); }
      if (status === 'errUsername') { setLoadingStatue('starting');  setErrStatus(['wrong username/email',' ']) ; setLoadingClass("hidden");socket.disconnect()  };
      if (status === 'errPwd' )  { setLoadingStatue('starting');  setErrStatus([' ','wrong password']);  setLoadingStatue('starting') ;setLoadingClass('hidden'); socket.disconnect() }
      
      }
  );

  }

  return (
    
  <div className=' w-full h-screen flex flex-col  justify-center align-middle items-center m-0 p-0'>
  
    <div className={`${loadingClass}  h-full bg-gray-100 w-full`}>
      <div id='loading' className={ `${loadingClass}   bg-gray-100 absolute z5 w-full h-full flex justify-center items-center flex-col `} >
      <lottie-player
        src="https://lottie.host/d23a830a-429b-4e63-b5e7-3f03b1281d4d/tPYCTl1Vty.json"
        background="##F3F4F6"
        speed="1"
        style={{ width: "150px", height: "150px" }}
        loop
        autoplay
        direction="1"
        mode="normal"
      ></lottie-player>
       <p className='font-semibold ' >{loadingStatue}</p>
      </div>
   </div>
  

      <div className='bg-gray-100 border rounded-md w-96 h-5/6 flex flex-col justify-center align-middle items-center '>
         
            <div className="w-full b-gray-500 mt-10 mb-5 flex justify-center ">
               <img className='w-64' src="https://learn.altissia.org/platform/images/logo/altissia/logo-full.svg" alt="AltissiaLogo" />
             </div>
              <div className='flex flex-col justify-center items-center p-3 gap-3 align-middle w-full '>
              <h1 className='w-full text-center  font-bold text-2xl' >Log in</h1> 
              <form onSubmit={handleLogin} className='flex flex-col gap-3 w-full px-5 py-2'>
                <div className='flex flex-col justify-center align-middle gap-1'>
                <label   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>

                <input type="text" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                <p className='text-red-600 font-semibold' > {errStatus[0]}</p>
                </div>
                
                <div className='flex flex-col justify-center align-middle gap-1'>
                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>

                <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
                <p className='text-red-600 font-semibold' > {errStatus[1]}</p>
                </div>
                <div className='flex flex-col  justify-center align-middle  mt-3' > 
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5  mb-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 duration-500">Log in</button>          
                </div>

               

              </form>

               </div>
      </div>

    </div>
  )

}

  