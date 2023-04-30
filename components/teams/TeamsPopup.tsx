import { useRouter } from 'next/router'
import React from 'react'
import { useAuth } from '../../context/auth/AuthContext'
import AddButton from '../buttons/AddButton'
import Button from '../buttons/Button'
import SubmitTasksButton from '../buttons/SubmitTasksButton'
import Clock from '../Clock'

const TeamsPopup = ({ routeTeam, teams, close }: any) => {
    const router = useRouter()

    const handleCreateTeam = () => {
        router.push('/createteam')
        close();
    }


    const handleRouteTeam = (team: any) => {
        routeTeam(team)
    }

    return (
        <div className='text-sm shadow rounded  z-50 bg-white'>
            <div className='w-full flex flex-col border-b  bg-white p-3'>
                <div className='mb-3 font-semibold'>Teams</div>
                <div className='flex flex-col space-y-3 group'>
                    {teams.map((team: any) =>
                        <div onClick={() => handleRouteTeam(team)}>
                            <Button text={team.name} theme="blue" />
                        </div>)}
                </div>

            </div>

            <div onClick={handleCreateTeam} className='px-3 flex items-center group  py-2 space-x-3  hover:bg-blue-100 text-gray-500   transition ease-in-out cursor-pointer duration-200'>
                <AddButton height="4" width="4" />
                <div className='text-gray-400 font-semibold group-hover:text-blue-400 w-3/4 flex justify-between items-center transition ease-in-out cursor-pointer duration-200'>
                    Create Team
                </div>
            </div>
        </div>
    )
}

export default TeamsPopup