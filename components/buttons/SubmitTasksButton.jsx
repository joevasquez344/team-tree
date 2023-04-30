import React, { useState } from "react";
import CreateTasksForm from "../tasks/CreateTasksForm";
import Modal from "../layout/Modal";
import CheckButton from "./CheckButton";

const SubmitTasksButton = (submitted, setSubmitted, task, setTask) => {
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [input, setInput] = useState("");

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div
          onClick={openModal}
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          className="flex py-1 items-center pl-6 space-x-2 bg-blue-400 hover:bg-yellow-400 text-white cursor-pointer transition ease-in-out duration-200"
        >
          {" "}
          {hover ? (
            <div className=" flex items-center space-x-8 transition ease-in-out cursor-pointer duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              <div>Edit Tasks</div>
            </div>
          ) : (
            <>
              <div className=" flex items-center space-x-8 transition ease-in-out cursor-pointer duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <div>Tasks Submitted </div>
              </div>
              <CheckButton />
            </>
          )}
        </div>
      ) : (
        <div
          className="py-1 pl-6 flex items-center space-x-8 text-blue-400 border border-blue-400 hover:bg-blue-400 hover:text-white transition ease-in-out cursor-pointer duration-200"
          onClick={openModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>{" "}
          <div>Submit Today's Tasks</div>
        </div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <CreateTasksForm
          setInput={setInput}
          setSubmitted={setSubmitted}
          submitted={submitted}
          task={task}
          input={input}
          closeModal={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default SubmitTasksButton;
