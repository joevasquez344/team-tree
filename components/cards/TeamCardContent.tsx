import { useRouter } from 'next/router'
import React from 'react'


const TeamCardContent = ({ item }: any) => {
    const router = useRouter();

    const route = () => router.push(`/teams/${item.id}`)
    const member = item.teamMembersAmount === 0 || item.teamMembersAmount > 1 ? "Members" : "Member"
    const group = item.groupsAmount === 0 || item.groupsAmount > 1 ? "Groups" : "Group"

    return (
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer' onClick={route}>
            <div className='text-gray-400 text-xl'>
                {item.name}
            </div>
            <div className='flex items-center space-x-2'>
                <div className='flex items-center space-x-1'>
                    <div className='text-blue-400'>
                        {item.teamMembersAmount}
                    </div>
                    <div className='text-gray-400'>{member}</div>
                </div>
                <div className='flex items-center space-x-1'>
                    <div className='text-blue-400'>{item.groupsAmount}</div>
                    <div className='text-gray-400'>{group}</div>
                </div>
            </div>
        </div>
    )
}

export default TeamCardContent