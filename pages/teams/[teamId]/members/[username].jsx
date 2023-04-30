import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../../context/auth/AuthContext";
import MessageButton from "../../../../components/buttons/MessageButton";
import SettingsButton from "../../../../components/buttons/SettingsButton";
import TrashButton from "../../../../components/buttons/TrashButton";
import Navbar from "../../../../components/layout/Navbar/Navbar";
import GroupButton from "../../../../components/buttons/GroupButton";
import AddButton from "../../../../components/buttons/AddButton";
import Modal from "../../../../components/layout/Modal";
import CreateGroupForm from "../../../../components/groups/CreateGroupForm";
import { getTeamMembers, getUserByUsername } from "../../../../utils/api/users";
import { getUsersTasks } from "../../../../utils/api/tasks";
import { auth } from "../../../../firebase/config";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { getAuthsTeams } from "../../../../utils/api/teams";
import { Tooltip } from "@material-tailwind/react";

// export const getStaticPaths = async () => {
//   const users = await getTeamMembers();

//   const paths = users.map(user => {
//     return {
//       params: { username: user?.username }
//     }
//   })

//   return {
//     paths,
//     fallback: false
//   }
// }
// export const getStaticProps = async (context) => {
//   const user = await getUserByUsername(context.params.username)
//   const teams = await getAuthsTeams();
//   // const tasks = await getUsersTasks(user.id)
//   return {
//     props: { user, teams }
//   }
// }

const Profile = () => {
  const router = useRouter();
  const { setAuthLayout, authUser } = useAuth();
  const [profile, setProfile] = useState({});
  const [teams, setTeams] = useState([]);

  const getAuthProfile = async () => {
    //
    const teams = await getAuthsTeams();
    setTeams(teams);
  };

  const getTeamMemberProfile = async () => {
    // Check
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserByUsername(router.query.username);
      if (user.id === authUser.id) {
      } else {
      }

      setProfile(user);
      setAuthLayout(false);
    };

    fetchData();
  }, [router.query.username]);
  return (
    <ProtectedRoute>
      <div className="w-screen h-screen py-16 bg-gray-100">
        <div className="w-1/2 shadow-lg mx-auto bg-white p-5">
          <div className=" mb-5 border-b pb-5">
            <div className="bg-white flex justify-between rounded-lg ">
              <div className="flex space-x-3">
                <img
                  className="h-20 w-20 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <div>
                  <div className="font-bold text-blue-400">{profile.name}</div>
                  <div className="font-semibold text-gray-400">
                    @{profile.username}
                  </div>
                  <div className="text-gray-400">{profile.email}</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Tooltip
                  placement="bottom"
                  content={
                    profile.id === authUser.id
                      ? "Leave Team"
                      : `Remove ${profile.name} from team`
                  }
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 1 },
                  }}
                  className="hidden sm:flex px-3 py-2 rounded-md text-xs text-red-400 font-bold bg-transparent z-50"
                >
                  <div className="bg-red-100 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </Tooltip>
                {authUser.id !== profile.id && (
                  <Tooltip
                    placement="bottom"
                    content="Message"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 1 },
                    }}
                    className="hidden sm:flex px-3 py-2 rounded-md text-xs text-blue-400 font-bold bg-transparent z-50"
                  >
                    <div className="bg-blue-100 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
                      <MessageButton />
                    </div>
                  </Tooltip>
                )}
                {authUser.id === profile.id && (
                  <Tooltip
                    placement="bottom"
                    content="Edit Profile"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 1 },
                    }}
                    className="hidden sm:flex px-3 py-2 rounded-md text-xs text-blue-400 font-bold bg-transparent z-50"
                  >
                    <div className="bg-blue-100 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
                      <SettingsButton />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-lg">
            <div className="bg-white flex-col space-y-4  ">
              <div className="font-bold px-5 py-1 bg-blue-100 inline-block text-blue-400 ">
                Team 1
              </div>
              <div className="shadow flex items-center justify-between cursor-pointer pr-4 relative">
                <div className=" group h-full w-full">
                  <div className="font-semibold text-blue-400   group-hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200 p-4">
                    Group 1
                  </div>
                </div>
                <Tooltip
                  placement="left"
                  content={
                    profile.id === authUser.id
                      ? "Leave Group"
                      : `Remove ${profile.name} from group`
                  }
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 1 },
                  }}
                  className="hidden sm:flex px-3 py-2 rounded-md text-xs text-red-400 font-bold bg-transparent z-50"
                >
                  <div className="rounded-l-full h-full py-2 absolute right-0 z-50 bg-white px-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex justify-center items-center cursor-pointer">
                      <TrashButton />
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div className="shadow flex items-center justify-between cursor-pointer pr-4 relative">
                <div className=" group h-full w-full">
                  <div className="font-semibold text-blue-400   group-hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200 p-4">
                    Group 2
                  </div>
                </div>
                <Tooltip
                  placement="left"
                  content={
                    profile.id === authUser.id
                      ? "Leave Group"
                      : `Remove ${profile.name} from group`
                  }
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 1 },
                  }}
                  className="hidden sm:flex px-3 py-2 rounded-md text-xs text-red-400 font-bold bg-transparent z-50"
                >
                  <div className="rounded-l-full h-full py-2 absolute right-0 z-50 bg-white px-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex justify-center items-center cursor-pointer">
                      <TrashButton />
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div className="shadow flex items-center justify-between cursor-pointer pr-4 relative">
                <div className=" group h-full w-full">
                  <div className="font-semibold text-blue-400   group-hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200 p-4">
                    Group 3
                  </div>
                </div>
                <Tooltip
                  placement="left"
                  content={
                    profile.id === authUser.id
                      ? "Leave Group"
                      : `Remove ${profile.name} from group`
                  }
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 1 },
                  }}
                  className="hidden sm:flex px-3 py-2 rounded-md text-xs text-red-400 font-bold bg-transparent z-50"
                >
                  <div className="rounded-l-full h-full py-2 absolute right-0 z-50 bg-white px-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex justify-center items-center cursor-pointer">
                      <TrashButton />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
