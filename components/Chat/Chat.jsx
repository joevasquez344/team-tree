import React, { useRef, useState, useEffect } from "react";
import AvatarDefault from "../users/AvatarDefault";
import Skeleton from "react-loading-skeleton";
import { useTeams } from "../../context/TeamsContext";
import { input } from "@material-tailwind/react";
import moment from "moment";
import styles from "./Chat.module.css";
import { useRouter } from "next/router";
import ChatError from "./ChatError";

const skeletons = [1, 2, 3, 4, 5, 6];

// Todos
//  1. Capture live updates to reflect on clients for a user editing their nessage
const Chat = ({ messages, reply }) => {
  const [hover, setHover] = useState(-1);
  const [inputEl, setInputEl] = useState(-1);
  const [input, setInput] = useState("");
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const {
    editTeamMessage,
    editGroupMessage,
    editDirectMessage,
    deleteTeamMessage,
    deleteGroupMessage,
    deleteDirectMessage,
    convertMessages,
    chatEndRef,
    chatStartRef,
    scrollToBottom,
    chatLoading,
    team,
    group,
  } = useTeams();
  const ref = useRef(null);
  const router = useRouter();

  const editMessage = async (e, message, text) => {
    e.preventDefault();
    if (
      router.query.teamId &&
      !router.query.groupId &&
      !router.query.username
    ) {
      await editTeamMessage(message, text);
    } else if (
      router.query.teamId &&
      router.query.groupId &&
      !router.query.username
    ) {
      editGroupMessage(message, text);
    } else {
      editDirectMessage(message, text);
    }

    handleRemoveInputFocus();
  };

  const handleFocusInput = (i, message) => {
    setInputEl(i);
    setInput(message.text);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleRemoveInputFocus = () => {
    setInputEl(-1);
    setInput("");
  };

  const showMore = (id) => {
    if (inputEl === id) return;
    setHover(id);
  };
  const hideMore = (id) => {
    if (inputEl === id) return;
    setHover(-1);
  };

  const handleDateDisplay = (date) => {
    const today = moment(new Date()).format("M D YY");

    if (date === today) {
      return "Today";
    }
    return date
      .split(" ")
      .map((item) => item + "/")
      .join("")
      .slice(0, -1);
  };

  const handleDeleteMessage = () => {
    if (
      router.query.teamId &&
      !router.query.groupId &&
      !router.query.username
    ) {
      deleteTeamMessage(messageToDelete);
    } else if (
      router.query.teamId &&
      router.query.groupId &&
      !router.query.username
    ) {
      deleteGroupMessage(messageToDelete);
    } else {
      deleteDirectMessage(messageToDelete);
    }
    setDeletePrompt(false);
  };

  const handleOpenDeletePrompt = (messageId) => {
    setDeletePrompt(true);
    setMessageToDelete(messageId);
  };

  const isReply = (message) =>
    message.replyTo.path.split("/")[1] === null ? false : true;

  useEffect(() => {
    if (inputEl !== -1) {
      ref.current.focus();
    }
  }, [inputEl]);

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);
  return (
    <>
      {messages?.length === 0 && !chatLoading ? (
        <ChatError
          chatName="Name"
          // chatName={
          //   router.query.teamId &&
          //   !router.query.groupId &&
          //   !router.query.username
          //     ? team.name
          //     : router.query.teamId &&
          //       router.query.groupId &&
          //       !router.query.username
          //     ? group?.name
          //     : router.query.username
          // }
        />
      ) : (
        <div className="relative flex flex-col space-y-3 pt-3  h-screen overflow-y-scroll no-scrollbar pb-64">
          <div ref={chatStartRef} />

          {deletePrompt && (
            <div className="fixed top-0 right-0 bottom-0 left-0 flex z-40 items-center justify-center">
              <div className=" absolute top-0 right-0 bottom-0 left-0 bg-black opacity-70"></div>
              <div className="z-50  h-36 bg-gray-800 shadow-xl rounded-xl py-5 px-7 flex flex-col items-center ">
                <>
                  <div className="text-white mb-7">
                    Are you sure you want to delete this message?
                  </div>
                  <div className="flex items-center justify-evenly w-full">
                    <div
                      onClick={handleDeleteMessage}
                      className="bg-red-500 text-white font-semibold py-1 px-7 cursor-pointer rounded"
                    >
                      Delete
                    </div>
                    <div
                      onClick={() => setDeletePrompt(false)}
                      className="bg-gray-400 text-white font-semibold py-1 px-7 cursor-pointer rounded"
                    >
                      Cancel
                    </div>
                  </div>
                </>
              </div>
            </div>
          )}
          {chatLoading ? (
            <div className="px-7 pt-3">
              {skeletons.map((item) => (
                <div key={item} className="flex space-x-3 mb-7">
                  <div className="w-10 h-10 rounded-full">
                    <Skeleton
                      className="w-full h-full rounded-full"
                      baseColor="rgb(31 41 55)"
                      count={1}
                      width="100%"
                      height="100%"
                      borderRadius="500px"
                      highlightColor="rgb(55 65 81)"
                      enableAnimation={true}
                      direction="rtl"
                      duration={1}
                    />
                  </div>
                  <div className="w-1/2">
                    <Skeleton
                      className="mb-3"
                      baseColor="rgb(31 41 55)"
                      count={1}
                      width="100px"
                      height="20px"
                      highlightColor="rgb(55 65 81)"
                      enableAnimation={true}
                      direction="rtl"
                      duration={1}
                    />

                    <Skeleton
                      baseColor="rgb(31 41 55)"
                      count={1}
                      height="150px"
                      // width="1000px"
                      highlightColor="rgb(55 65 81)"
                      enableAnimation={true}
                      direction="rtl"
                      duration={1}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            convertMessages(messages ? messages : [])?.map((item) => (
              <div key={item.id}>
                <div className={`flex items-center justify-center px-7`}>
                  <div className="flex items-center space-x-3 ">
                    <div className="h-[1px] w-screen bg-gray-500"></div>
                    <div className="text-gray-300 text-sm ">
                      {/* {handleMessageCreatedAt(message)} */}
                      {handleDateDisplay(item[0])}
                    </div>
                    <div className="h-[1px] w-screen bg-gray-500"></div>
                  </div>
                </div>
                {item[1].map((message) => (
                  <div key={message.id}>
                    <div
                      onMouseOver={() => showMore(message.id)}
                      onMouseLeave={hideMore}
                      className={`group hover:bg-gray-800 ${
                        message?.type === "task" && " "
                      }  ${
                        inputEl === message.id && "bg-gray-800"
                      } transition ease-in-out duration-200 px-7 py-3`}
                    >
                      {message.replyTo?.id && message.replyToText ? (
                        <div className="flex items-center relative">
                          <div className="absolute  w-12 top-3 pr-2 flex flex-col items-end  mb-3">
                            <div className="h-2.5 w-2.5 bg-green-500 mb-1 rounded-full"></div>
                            <div className="h-1.5 w-1.5 bg-green-500 mb-2 mr-4 rounded-full"></div>
                            <div className="h-1 w-1 bg-green-500 mx-auto rounded-full"></div>
                          </div>
                          {/* <div className="absolute  w-12 top-3 pr-2  flex flex-col items-end  mb-3">
                  <div className="flex w-full items-center  justify-center mb-3">
               
                    <div className="h-2 w-2 bg-green-500  rounded-full"></div>
                  </div>
                 
                  <div className="flex w-full ">
                    <div className="h-1 w-1  bg-green-500 mx-auto rounded-full"></div>
                  </div>
                </div> */}
                          <div
                            className={`inline-flex ml-12 mb-3 bg-gray-900 rounded-md shadow-xl p-3`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center bg-red-500 mr-2`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="white"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className={"w-3 h-3 text-white"}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                              </div>

                              <div className="text-gray-400 text-xs mr-2">
                                @{message.replyTo.user.username}
                              </div>
                              <div className="">
                                {message.replyTo.isEdited && (
                                  <div className="text-yellow-400 text-xs mr-1">
                                    Edited
                                  </div>
                                )}
                              </div>
                              <div className="text-gray-300 text-xs ">
                                {message.replyToText}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        message.replyTo === null && (
                          <div className="flex items-center relative">
                            <div className="absolute  w-12 top-3 pr-2 flex flex-col items-end  mb-3">
                              <div className="h-2.5 w-2.5 bg-green-500 mb-1 rounded-full"></div>
                              <div className="h-1.5 w-1.5 bg-green-500 mb-2 mr-4 rounded-full"></div>
                              <div className="h-1 w-1 bg-green-500 mx-auto rounded-full"></div>
                            </div>
                            <div
                              className={`inline-flex ml-12 mb-3 bg-gray-900 rounded-md shadow-xl p-3`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center bg-red-500 mr-2`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={"w-3 h-3 text-white"}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                  </svg>
                                </div>

                                <div className="text-red-500 text-xs mr-1">
                                  Message Deleted
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      <div className="flex justify-between relative ">
                        <div className="flex space-x-3 w-full">
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/teams/${router.query.teamId}/chat/${message.user.username}`
                              )
                            }
                          >
                            <AvatarDefault color="blue" />
                          </div>
                          <div className="w-full">
                            <div className="flex items-center text-gray-300 space-x-1">
                              <div className="font-semibold text-white">
                                <div>{message?.user?.name}</div>
                              </div>
                              <div className="text-sm">
                                @{message?.user?.username}
                              </div>
                            </div>
                            <div className="flex space-x-3 cursor-default">
                              {inputEl === message.id ? (
                                <div className="flex flex-col w-full">
                                  {" "}
                                  {message?.type === "task" ? (
                                    <div className="border relative flex justify-between bg-gray-700 border-gray-600  my-2 w-full text-gray-300 p-3 rounded-md">
                                      <input
                                        ref={ref}
                                        onChange={handleInputChange}
                                        placeholder={message.text}
                                        value={input}
                                        className="text-gray-300 outline-none bg-transparent w-full"
                                      />

                                      <div className="h-7 w-7 absolute -right-3 top-2.5  flex items-center justify-center rounded-full border bg-gray-700 group-hover:bg-gray-800 border-gray-500 transition ease-in-out duration-200">
                                        <TaskIcon />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="border relative flex justify-between bg-gray-700 border-gray-600 my-2 w-full text-gray-300 p-3 rounded-md ">
                                      <form
                                        onSubmit={(e) =>
                                          editMessage(e, message, input)
                                        }
                                        className="w-full"
                                      >
                                        <input
                                          value={input}
                                          ref={ref}
                                          onChange={handleInputChange}
                                          placeholder={message.text}
                                          className="text-gray-300 outline-none bg-transparent w-full"
                                        />
                                      </form>
                                    </div>
                                  )}
                                  <div
                                    onClick={handleRemoveInputFocus}
                                    className="text-green-500 text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {" "}
                                  {message?.type === "task" ? (
                                    <div className="border relative flex justify-between border-gray-600 group-hover:border group-hover:border-gray-700 my-2 w-full text-gray-300 p-3 rounded-md transition ease-in-out duration-200">
                                      <div>{message.text}</div>

                                      <div className="h-7 w-7 absolute -right-3 top-2.5  flex items-center justify-center rounded-full border bg-gray-700 group-hover:bg-gray-800 border-gray-500 transition ease-in-out duration-200">
                                        <TaskIcon />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-300">
                                      {message.text}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${
                            hover !== message.id && "hidden"
                          } flex items-center  rounded-md text-gray-300 absolute -right-3 -top-6 bg-gray-900  shadow-lg transition ease-in-out duration-200`}
                        >
                          <div
                            onClick={() => reply(message)}
                            className="hover:bg-gray-700 h-6 flex items-center justify-center rounded-tl-md rounded-bl-md px-2 py-4 transition ease-in-out duration-200 cursor-pointer"
                          >
                            <ReplyIcon />
                          </div>
                          <div
                            onClick={() =>
                              handleFocusInput(message.id, message)
                            }
                            className="hover:bg-gray-700 h-6 flex items-center justify-center rounded-tl-md rounded-bl-md px-2 py-4 transition ease-in-out duration-200 cursor-pointer"
                          >
                            <EditIcon />
                          </div>
                          <div
                            onClick={() => handleOpenDeletePrompt(message.id)}
                            className="hover:bg-gray-700 transition ease-in-out px-1 py-2 duration-200 cursor-pointer rounded-tr-md rounded-br-md"
                          >
                            <TrashIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      )}
    </>
  );
};

const MoreIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-gray-300"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
};

const TaskIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 text-green-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </svg>
  );
};

const ReplyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </svg>
  );
};

const EditIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      />
    </svg>
  );
};

const TrashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
};

export default Chat;
