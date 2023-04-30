import React, { useState } from 'react'
import { useAuth } from '../context/auth/AuthContext';
import ClockButton from './buttons/ClockButton'

const Clock = () => {
    const { authUser }: any = useAuth()

    return (
        <div className=' w-full  '>
            
            <div className=''>
                <ClockButton />
            </div>
          
        </div>
    )
}

export default Clock