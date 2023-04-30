import React, { useState } from "react";
import Modal from "../layout/Modal";
import Avatar from "./Avatar";

const UserCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  

  return (
    <>
      <div className="border-b  sm:border-r sm:border-b lg:border p-3  bg-white rounded-xl">
        <div className="flex">
          <Avatar user={user} />
          <div>
            <div className="font-bold">{user.name}</div>
            <div>{user.role}</div>
            <div className="mt-3">
              Clocked in at:{" "}
              <span className="text-green-500 font-bold">10:36 am</span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-2 mt-3 text-blue-400 border border-blue-400 py-1 text-sm font-semi-bold hover:bg-blue-400 hover:text-white transition ease-in-out cursor-pointer duration-200"
            >
              View Today's Tasks
            </button>
          </div>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque,
          sed.
        </Modal>
      </div>
    </>
  );
};

export default UserCard;
