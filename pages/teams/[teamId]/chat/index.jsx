import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../context/auth/AuthContext";
import Chat from "../../../../components/Chat/Chat";
import Members from "../../../../components/users/Members";
import { useTeams } from "../../../../context/TeamsContext";
import { Tooltip } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";

const TeamChat = () => {
  const router = useRouter();
  const ref = useRef(null);
  const { setAuthLayout } = useAuth();
  const {
    teamMembers,
    teamChat,
    team,
    getTeam,
    teamLoading,
    addTeamMessage,
    addTeamReply,
    error,
    setError,
    builder,
  } = useTeams();

  const [input, setInput] = useState("");
  const [task, setTask] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const handleTaskDesignation = () => {
    setTask(task ? false : true);
  };

  const createMessage = async (e) => {
    e.preventDefault();
    if (input.length === 0) return;
    const type = task ? "task" : "message";
    addTeamMessage(type, input);

    setInput("");
  };

  const createReply = async (e) => {
    e.preventDefault();
    if (input.length === 0) return;
    await addTeamReply(replyTo, input);
    setReplyTo(null);
    setInput("");
  };

  const handleFocusInput = (message) => {
    setReplyTo(message);
    ref.current.focus();
  };

  const handleUnfocusInput = () => setReplyTo(null);

  useEffect(() => {
    setError(false);
    getTeam();
    setAuthLayout(true);
  }, [router.query.teamId]);

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center mt-96">
        <div className="text-gray-300 text-3xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700">
      <div className="h-12 bg-gray-700  border-b border-b-gray-600 px-5 flex items-center text-gray-200 text-lg font-semibold">
        {teamLoading ? (
          <Skeleton
            className="h-6"
            baseColor="rgb(31 41 55)"
            count={1}
            width="200px"
            highlightColor="rgb(55 65 81)"
            enableAnimation={true}
            direction="rtl"
            duration={1}
          />
        ) : (
          <div>{team.name} Chat</div>
        )}
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-10 overflow-y-scroll no-scrollbar h-screen relative">
          <Chat
            messages={teamChat.messages}
            reply={handleFocusInput}
            replyTo={replyTo}
          />

          <div
            className={`absolute bg-gray-700 bottom-24 w-full ${
              replyTo === null ? "pt-5" : "pt-3"
            }  pb-10  px-7 border-t border-t-gray-600 z-30 `}
          >
            <div className="h-full">
              {replyTo !== null && (
                <div className="flex items-center space-x-1 mb-2">
                  <div className="text-gray-300">Replying to</div>
                  <div className="text-green-500"> {replyTo.user.name}</div>
                </div>
              )}
              <form
                onSubmit={replyTo === null ? createMessage : createReply}
                className={`${
                  replyTo !== null && "border border-green-500"
                } h-full flex items-center bg-gray-600`}
              >
                {replyTo === null && (
                  <div className="ml-3">
                    <Tooltip
                      placement="bottom"
                      content={
                        task ? "Remove Task Designation" : "Assign as Task"
                      }
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 1 },
                      }}
                      className="hidden sm:flex px-3 py-2 rounded-md text-xs text-green-500 font-bold bg-transparent z-50"
                    >
                      <div
                        onClick={handleTaskDesignation}
                        className={`h-7 w-7 rounded-full ${
                          task ? "bg-green-300" : "border border-gray-500"
                        }  flex justify-center items-center cursor-pointer`}
                      >
                        <TaskIcon />
                      </div>
                    </Tooltip>
                  </div>
                )}

                <input
                  ref={ref}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full py-3 px-5 bg-gray-600  outline-none text-gray-400"
                  type="text"
                  placeholder={
                    replyTo !== null
                      ? `Reply to ${replyTo.user.name}`
                      : `Type ${task ? "Task" : "Message"}`
                  }
                />
                {task && (
                  <div className="mx-3 text-sm border border-green-500 text-green-500 px-5 rounded-sm">
                    Task
                  </div>
                )}
              </form>
              {replyTo !== null && (
                <div
                  onClick={handleUnfocusInput}
                  className="text-green-500 text-xs cursor-pointer mt-3"
                >
                  Cancel
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-l border-l-gray-600 h-screen col-span-2">
          <Members members={team.members} type="chat" />
        </div>
      </div>
    </div>
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

export default TeamChat;
