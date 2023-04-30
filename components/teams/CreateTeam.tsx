import { useRouter } from 'next/router'
import React, { useState } from 'react'
import AddButton from '../buttons/AddButton'
import GroupButton from '../buttons/GroupButton'
import CreateGroupForm from '../groups/CreateGroupForm'
import Modal from '../layout/Modal'

const CreateTeam = () => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    return (
        <>
            <div className='px-5 lg:px-0 py-5 flex justify-between items-center'>
                <div className='font-bold text-2xl text-gray-500'>Your affiliated groups</div>
            </div>
            <div>
                <div className='flex flex-col justify-center items-center p-5'>
                    <div className='relative flex items-center mb-2'>
                        <GroupButton />
                        <div className='absolute bottom-0 right-0'>
                            <AddButton />
                        </div>
                    </div>
                    <div onClick={() => router.push('/createteam')} className='text-blue-400 font-semibold mb-2 px-5 py-2 shadow rounded hover:bg-blue-100   transition ease-in-out cursor-pointer duration-200'>
                        Create Team
                    </div>
                    <div className="text-center text-gray-500 xl:w-1/3">
                        Create a team to view each others daily tasks, and collaborate in groups and meetings
                    </div>
                </div>
            </div>


            <Modal show={showModal} onClose={() => setShowModal(false)}>
                {/* <CreateGroupForm /> */}
            </Modal>
        </>
    )
}

export default CreateTeam