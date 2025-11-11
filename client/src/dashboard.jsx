import React, { useEffect } from 'react'
import './index.css'
import { useState,useRef } from 'react';
import { Navigate } from "react-router-dom";


export default  function Dashboard({ socket,isLoggedIn, setIsLoggedIn,userdata,setUserData,frData }) {


  //console.log(userdata);
 // userdata.process.courses[indeex].Actv[ii]
 

  let handleStart = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
      intervalRef.current = setInterval(() => {
      totalSecondsRef.current += 1;  
      const hourss = Math.floor(totalSecondsRef.current / 3600);
      const remainingSeconds = totalSecondsRef.current % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      setActualH(`${hourss}h. ${minutes}min. ${seconds}sec.`);
    }, 1000);
  };
  
  let handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  let actvHandling =  ({username,email,password}) =>{
    setActvsEvent('flex');
    const lang = userdata.actualLang;
    //console.log({ lvl,actv,msg,username,email,password });
    socket.emit('runActv',{ username,email,password,lang });
  }


  const handleSwitchLang = async(lang) =>{
    setHoursEvent('flex');
     socket.emit('switchLang',{lang,email,password});
     let userdata1 = userdata;
    userdata.actualLang ==  'français'?   userdata1.actualLang = 'anglais' :userdata1.actualLang = 'français'

     setUserData( userdata1 );
     localStorage.setItem('userdata', JSON.stringify(userdata));
  }

  socket.on('switchStatus',async()=>{
     setHoursEvent('hidden');
  });


   
  

  socket.on('hoursStatus', async ({ status, hours }) => {
    // Parse the input string to extract hours and minutes
    const match = hours.match(/(\d+)h\. (\d+)min\./);
    if (!match) {
      throw new Error("Invalid time format");
    }
  
    const hourss = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = 0;  
    // Convert the time into total seconds and persist it in the ref
    totalSecondsRef.current = hourss * 3600 + minutes * 60 + seconds;
  
    setActualH(`${hourss}h. ${minutes}min. ${seconds}sec.`);
    setLoadingHEvent('hidden');
  
    handleStart(); // Start the interval
  });

  socket.on('actvMsg',async({msg,status})=>{

       setActvMsg(msg);
       if (status){
        setActvsEvent('hidden');
       }

  });

 

  socket.on('actvStatus',async(msg)=>{
  
    setActvStatus(msg);
    if (msg ==='Done'){
      setActvStatus('wait a moment...');
      setActvsEvent('hidden');

    }
   
   
  });
  

  const [hoursBtn,setHoursBtn] = useState(false);
  const [email,setEmail] = useState(userdata.email);
  const [password,setPassword] = useState(userdata.password);
  const [activeLevel,setActiveLevel] = useState('A1-');
  const [hoursEvent,setHoursEvent]= useState('hidden');
  const [loadingHEvent,setLoadingHEvent] = useState('flex');

  const [hoursC,setHoursC] = useState('');
  const [actualH,setActualH] = useState('');
  const [hInterval,setHInterval] = useState(null);

  const [actvsEvent,setActvsEvent] = useState('hidden');
  const [loadingAEvent,setLoadingAEvent] = useState('flex');
  const [actvMsg,setActvMsg] = useState('loading the modules');
  const [actvStatus,setActvStatus] = useState('wait a moment...');

  const intervalRef = useRef(null);
  const totalSecondsRef = useRef(0); // Ref to persist totalSeconds
  let lang;

  useEffect(()=>{


    let toggleBtns = document.querySelectorAll('.activityBtn');
    
    let toggleContents = document.querySelectorAll('.activitiesC');
  
    toggleBtns.forEach(  (btn, index) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        toggleContents[index].classList.toggle('hidden'); 
        toggleContents[index].classList.toggle('flex');

      });
    });

    let levelBtns =  document.querySelectorAll('button.levelBtns');
    let levelsC = document.querySelectorAll('div.levels');

    levelBtns.forEach(  (btn, index) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        [...levelsC].map((level)=>{
          level.classList.add('hidden'); 
        });
        [...levelBtns].map((btnn)=> btnn.classList.remove('btnClick'));
        levelsC[index].classList.toggle('hidden'); 
        levelsC[index].classList.toggle('flex');
        btn.classList.add('btnClick');


      });
    });




   },[]);

   useEffect(()=>{
        if (hoursBtn){
              setHoursEvent('flex');
        }else{
          setHoursEvent('hidden');
        }

        // if ( hInterval) {
        //   console.log('clear');
        //   clearInterval(hInterval);
        //   setHInterval(null); // Reset interval state
        // }
   },[hoursBtn]);


  
  return (
  <>    
    <div className="h-screen w-full flex flex-col ">
        <nav className='flex w-full align-middle text-center justify-between  py-4 px-2  bg-slate-300 drop-shadow ' >
         <h1 className=' text-center align-middle justify-center font-semibold capitalize text-xs sm:text-sm lg:text-lg '>bonjour {userdata?.username?.toLowerCase()}</h1>
          <ul className='flex gap-24   justify-center text-center align-middle content-center '>
              <li className=' hover:scale-95 duration-200 '>
                <p onClick={()=>{userdata.actualLang=='français'?  lang = 'anglais' :lang = 'français' ; handleSwitchLang(lang)}}  className='cursor-pointer hover:opacity-90 font-semibold capitalize bg-blue-600 py-0.5 px-5 text-white rounded-xl'>{userdata.actualLang}</p>
            </li>  

            <li className='hover:scale-95 duration-200'>
                <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn');
                <Navigate to='/'/>;socket.disconnect(); console.log('logout'); }}> <i className="fa-solid fa-right-from-bracket"></i></button>
            </li>
          </ul>
        </nav>
          <section className='flex h-screen justify-center align-start   items-start  '>

                  <section className='w-full h-full flex flex-col justify-between '>
                      <section className={`${hoursEvent} flex  flex-col z-50  h-full w-full absolute `}>
                          <div id='loading' className={ ` ${loadingHEvent}  bg-gray-100 absolute z-50 w-full h-full  justify-center pb-32 items-center flex-col `} >
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
                                <p className='font-semibold ' >{'in any second'}</p>
                          </div>
                          <div className='flex gap-12  bg-gray-100 absolute  w-full h-full  justify-center pb-32 items-center flex-col ' >
                              <p className='font-bold text-5xl'>{actualH}</p>
                              <button className={` bg-blue-800 text-white  px-5 py-1 rounded-2xl hover:opacity-90 hover:scale-95 duration-200 text-xs sm:text-sm lg:text-lg`} onClick={()=>{socket.emit('stopHours',{username:userdata?.username?.toLowerCase()},email,password); setHoursBtn(!hoursBtn); setLoadingHEvent('flex'); handleStop()  }} >Stop Function</button>

                          </div>
                      </section>  

                      <section className={`${actvsEvent}  flex-col z-50  h-full w-full absolute `}>
                          <div id='loading' className={ ` ${loadingAEvent}  bg-gray-100 absolute z-50 w-full h-full  justify-center pb-32 items-center flex-col `} >
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
                                <p className='font-semibold ' >{actvStatus}</p>
                                <button className='mt-5 text-[#1c4072] bg-transparent  border border-[#1c4072] px-6 py-1 rounded-[15px] transition-all btnClick hover:text-white hover:bg-[#1c4072] ' onClick={()=>location.reload()}>Stop</button>
                          </div>
                          <div className='hidden  bg-gray-100 absolute  w-full h-full  justify-center pb-32 items-center flex-col ' >
                              <p className='font-bold text-5xl'>{actualH}</p>
                           
                          </div>
                      </section>  

                      

                      <section className="w-full h-full flex flex-row md:flex-row justify-center items-center align-middle gap-6   md:gap-12 pb-5 md:flex-wrap   ">
                        
                      <div onClick={()=>{socket.emit('runHours',{username:userdata?.username?.toLowerCase(),email,password}); setHoursBtn(!hoursBtn) }}   className=' gap-3 border-1 drop-shadow-2xl border-black flex flex-col justify-center  md:gap-16 hover:text-[#0e9f6e]   align-middle items-center  bg-slate-300 rounded-md hover:opacity-90 shadow-lg hover:scale-95 duration-200 hover:cursor-pointer w-[30%] h-[18%] md:w-[25%] md:h-[60%]'>

                          <i className=" md:text-6xl text-center  fa-solid fa-hourglass-start"></i>
                          <h1 className='text-sm  text-center md:text-4xl font-bold '>Add Hours</h1>

                      </div>


                             
                      <div onClick={()=>actvHandling({ username: userdata?.username?.toLowerCase(),
                                              email: userdata?.email,
                                              password: userdata?.password,
                                            })}  className='border-1 drop-shadow-2xl border-black flex flex-col justify-center gap-3  md:gap-16 hover:text-[#0e9f6e]   align-middle items-center  bg-slate-300 rounded-md hover:opacity-90 shadow-lg hover:scale-95 duration-200 hover:cursor-pointer w-[30%] h-[18%] md:w-[25%] md:h-[60%]'>

                          <i className="  md:text-6xl text-center fa-solid fa-book"></i>
                          <h1 className='text-sm md:text-4xl text-center font-bold '>Add Activities</h1>

                      </div>

                    
                      </section>

                  </section>

           

          </section>      
 

    </div>
    </>

  );
}

