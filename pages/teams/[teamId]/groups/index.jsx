import React, { useState } from 'react'
import AddButton from '../../../../components/buttons/AddButton'
import GroupButton from '../../../../components/buttons/GroupButton'
import CreateGroupForm from '../../../../components/groups/CreateGroupForm'
import Modal from '../../../../components/layout/Modal'

const Groups = () => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {/* <Navbar /> */}
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
          <div onClick={() => setShowModal(true)} className='text-blue-400 font-semibold mb-2 px-5 py-2 shadow rounded hover:bg-blue-100   transition ease-in-out cursor-pointer duration-200'>
            Create Group
          </div>
          <div className="text-center text-gray-500">
            Create a group and add team members
          </div>
        </div>
        <Groups />
      </div>


      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <CreateGroupForm />
      </Modal>
    </>
  )
}

export default Groups