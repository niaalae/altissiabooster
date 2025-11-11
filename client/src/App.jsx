import React, { useEffect, useState } from 'react';
import './index.css'
import { io } from 'socket.io-client';


const App = ({isLoggedIn,setIsLoggedIn}) => {

    const [status, setStatus] = useState('Not started');
    const [statusStyle,setStatusStyle] = useState('bg-red-500 ');
    const [timeAdded, setTimeAdded] = useState(0);
    const [actualTime,setActualTime] = useState('');
    const [socket, setSocket] = useState(null);
    const [emailC,setEmailC] = useState('');
    const [pwdC,setPwdC] = useState('');
    const [inputsC,setInputsC] = useState('hidden');

    // Initialize the socket connection
    const initializeSocket = () => {
         const socketConnection = io(import.meta.env.VITE_BACKENDHOST, {
        //    const socketConnection = io('http://localhost:5000', {

            withCredentials: true,  
            transports: ['websocket'],
        });
        
        socketConnection.on('timeUpdate', (newTime) => {
            console.log('Received time update:', newTime); 
            setTimeAdded(newTime);
        });

        socketConnection.on('statusUpdate', (data) => {
            console.log('Received status update:', data);  // Use .message to get the text
            setStatus(data);
        });

        return socketConnection;
    };

    useEffect(() => {
        const socketConnection = initializeSocket();
        setSocket(socketConnection);

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const startAutomation = () => {
        if (socket) {
            if (emailC !== '' && pwdC !== '' ){ 
                setInputsC('hidden');
                socket.emit('startAutomation', { email: emailC, pwd: pwdC });
                setStatus("Starting automation...");
                setStatusStyle('bg-green-600');
            } else{
                setInputsC('block');
            }
        } else {
            console.error("Socket not initialized");
        }
    };

    const stopAutomation = () => {
        if (socket) {
            console.log('Stopping automation...');
            socket.emit('stopAutomation');
            setStatus("Stopping automation...");
            setStatusStyle('bg-red-600');
        } else {
            console.error("Socket not initialized");
        }
    };

  

    return (
        
        <div className='flex justify-center align-middle items-center flex-col  m-5  ' >            
            <h1 className='text-5xl mb-10 bg-white p-3 px-10 rounded-xl font-semiBold  '>Altissia Booster</h1>
           
            <div className='flex w-full gap-5 justify-evenly align-middle items-center my-5' >
                <p className={`${statusStyle} px-5 py-2 rounded transition-all  ` }>{status}</p>
                {timeAdded != 0 ? <p className='bg-slate-400 px-5 py-2 rounded ' >+{timeAdded} seconds added</p> : <p className='bg-slate-400 px-5 py-2 rounded ' >No time added yet</p>}
            </div>
           
            <div className=' my-5'>
                <button className={`${status == 'Not started' || status == 'Automation Stopped' ? 'bg-green-500' : 'hidden' } text-white font-semibold px-5  border-black rounded-sm py-2 hover:bg-slate-200 hover:scale-95 hover:text-gray-500 transition-all `} onClick={startAutomation}>Start Automation</button>
                <button  className={`${status == 'Not started' || status == 'Automation Stopped' ? 'hidden' : 'bg-red-500'} text-white font-semibold  px-5  border-black rounded-sm py-2 hover:bg-green-200 hover:scale-95 hover:text-red-500 transition-all   `}  onClick={stopAutomation}>Stop Automation</button>
            </div>

            <div className={` ${ inputsC }  ' flex flex-col gap-5 justify-center align-middle items-center mt-10' `}>
                <input className=' w-72 px-5 py-2 bg-customGray border-gray-500 border-2 rounded-lg placeholder:text-gray-500 transition-all' type='text' onChange={(e)=>setEmailC(e.target.value)} value={emailC} placeholder='enter your email...'></input> 
                <input className='w-72 px-5 py-2 bg-customGray border-gray-500 border-2 rounded-lg placeholder:text-gray-500 transition-all' type='password'  onChange={(e)=>setPwdC(e.target.value)} value={pwdC} placeholder='enter your pwd...'></input>
            </div>

            <button onClick={()=>setIsLoggedIn(false)}>logout</button>
       
        </div>

    );
};

export default App;
