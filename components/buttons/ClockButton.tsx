import React, { useState } from 'react'
import { useAuth } from '../../context/auth/AuthContext';
import CheckButtons from './CheckButton';

const ClockButton = () => {
    const [hover, setHover] = useState(false);
    const { authUser, goOffline, goOnline }: any = useAuth()


    console.log('Auth: ', authUser)
    return (
        <div className='w-full text-sm'>

            {
                authUser.onlineStatus === "online" ? <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} onClick={goOffline} className={`py-1 flex space-x-8 items-center pl-6  bg-green-400 hover:bg-red-500 text-white transition ease-in-out cursor-pointer duration-200`
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    {hover ? <div>Clock Out</div> : <div className='flex items-center space-x-2'><span>Clocked In</span> <span><CheckButtons /></span></div>}
                </ div> : <div onClick={goOnline} className={`py-1 hover:bg-green-400 flex pl-6 items-center border border-green-400 text-green-400 hover:text-white transition ease-in-out cursor-pointer duration-200`
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Clock In </div>
            }
        </div>

    )
}

export default ClockButton