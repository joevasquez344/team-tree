import React from 'react'
import UserCards from './UserCards'



const AvatarDropdown = ({users}: any) => {
    return (
        <div className='h-full w-full mt-5 bg-gray-100 rounded-xl'>
            <UserCards users={users} />
        </div>
    )
}

export default AvatarDropdown