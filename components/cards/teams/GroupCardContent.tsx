import { useRouter } from 'next/router'
import React from 'react'


const GroupCardContent = ({ item }: any) => {
    const router = useRouter();
    return (
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer' onClick={() => router.push(`/teams/${item.id}`)}>
            <div className='text-gray-400 text-xl'>
                {item.name}
            </div>
            <div className='flex items-center space-x-2'>
                <div className='flex items-center space-x-1'>
                    <div className='text-blue-400'>
                        {/* {item.teamMembersAmount} */}
                        3 Members
                    </div>
                    {/* <div className='text-gray-400'>{item.teamMembersAmount === 0 || item.teamMembersAmount > 1 ? "Members" : "Member"}</div> */}
                </div>
                <div className='flex items-center space-x-1'>
                    
                    {/* <div className='text-blue-400'>{item.groupsAmount}</div>
                    <div className='text-gray-400'>{item.groupsAmount === 0 || item.groupsAmount > 1 ? "Groups" : "Group"}</div> */}

                </div>
            </div>
        </div>
    )
}

export default GroupCardContent