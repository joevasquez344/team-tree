import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import SubmitTasksButton from "../buttons/SubmitTasksButton";
import Clock from "../Clock";
import { getUsersTask } from "../../utils/api/tasks";
import moment from "moment";

const AvatarPopup = () => {
  const { logout, authUser } = useAuth();
  const router = useRouter();
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [task, setTask] = useState(null)
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const taskCreatedAt = (task) => {
    return moment.utc(task.createdAt.seconds * 1000).format("MM DD YY");
  };

  useEffect(() => {
    const fetchData = async () => {
      let now = moment().format("MM DD YY");

      let tasks = await getUsersTask(authUser.id);
      const taskPosted = tasks.find((task) => taskCreatedAt(task) === now);

      console.log('Task Posted: ', taskPosted)
      if (taskPosted) {
        setTaskSubmitted(true);
        setTask(taskPosted)
      } else {
        setTaskSubmitted(false);
        setTask(null)
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full flex flex-col text-sm shadow rounded bg-white p-3">
      <div className="flex  space-x-4 ">
        <div>
          <img
            onClick={() => router.push(`/profile/${authUser.username}`)}
            className="h-16 w-16 rounded-full cursor-pointer"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div>
          <div className="font-bold">{authUser.name}</div>
          <div className="text-gray-500">{authUser.email}</div>
          <div className="flex flex-col space-x-4">
            {authUser?.onlineHistory?.length === 0 ? (
              <div className="text-red-500 font-bold">Offline</div>
            ) : (
              <div className="">
                <span className="text-gray-500">
                  {authUser.onlineStatus === "online"
                    ? "Online at"
                    : "Offline at"}
                </span>{" "}
                <span
                  className={`text-${
                    authUser.onlineStatus === "online" ? "green" : "red"
                  }-500 font-bold`}
                >
                  {authUser.onlineHistory.slice(-1).pop() !== undefined &&
                    authUser.onlineHistory.slice(-1).pop()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex mt-4 group items-center  w-full">
        <Clock />
      </div>
      <div className="mt-4">
        <SubmitTasksButton submitted={taskSubmitted} setSubmitted={setTaskSubmitted} task={task} setTask={setTask} />
      </div>

      <div
        onClick={handleLogout}
        className={`flex mt-4 group items-center pl-6 space-x-8 bg-gray-100 hover:bg-blue-100 py-1 transition ease-in-out cursor-pointer duration-200`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-6 h-6 cursor-pointer text-gray-400 group-hover:text-blue-400 transition ease-in-out duration-200`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
        <div className="text-gray-500 group-hover:text-blue-400 transition ease-in-out cursor-pointer duration-200">
          Sign out
        </div>
      </div>
      {/* <div className='flex flex-col items-center space-x-4'>
               
                <Clock /> 
                <div className=''>
                    {
                        authUser?.onlineHistory?.length === 0 ? <div className='text-red-500 font-bold'>Offline</div> : <div className=""><span className='text-gray-500'>{authUser.onlineStatus === "online" ? 'Online at' : 'Offline at'}</span> <span className={`text-${authUser.onlineStatus === "online" ? 'green' : 'red'}-500 font-bold`}>{authUser.onlineHistory.slice(-1).pop() !== undefined && authUser.onlineHistory.slice(-1).pop()}</span></div>
                    }
                </div>
            </div> */}
    </div>
  );
};

export default AvatarPopup;
