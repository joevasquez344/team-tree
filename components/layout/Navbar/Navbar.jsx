import React from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import useNavbar from "./useNavbar";
import AvatarPopup from "../../users/AvatarPopup.jsx";
import { useTeams } from "../../../context/TeamsContext";
import Popup from "../../Popup";
import NotificationList from '../../notifications/NotificationList'
import NotificationIcon from './NotificationIcon';
import ProtectedComponent from '../../ProtectedComponent'

const user = {
  id: 1,
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  email: "joevasquez344@gmail.com",
  name: "Joe",
  username: "Zook_sc",
  status: "Clocked In",
};

const Navbar = () => {
  const {
    avatarPopup,
    notificationPopup,
    teamHeader,
    teamsPopup,
    notifications,
    onMount,
    routeTeam,
    routeTeams,
    openAvatarPopup,
    closeAvatarPopup,
    openNotificationPopup,
    closeNotificationPopup,
    openTeamsPopup,
    closeTeamsPopup
  } = useNavbar();
  const { teams } = useTeams();
  const { authUser, authLayout } = useAuth();
console.log("Working")
  if (!authUser && !authLayout) return null

  return (
    <>
      <div
        className={`relative flex items-center justify-end bg-gray-800 border-b border-b-gray-600 h-16`}
      >
        <div className="absolute left-1/2 -ml-20 flex items-center space-x-3 text-white">
          <div className="text-xl font-bold font-mono">
            Team Tree
          </div>
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
              d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525"
            />
          </svg>
        </div>
        <ProtectedComponent>
           <div className="flex items-center space-x-5">
            <div className="relative">
              <Popup closePopup={closeNotificationPopup} popup={notificationPopup}>
                <div className="absolute -left-[550px] top-8 z-50 shadow-lg rounded bg-white w-[550px]">
                  <NotificationList />
                </div>
              </Popup>
              <NotificationIcon openPopup={openNotificationPopup} />
            </div>
            <div className="relative ml-auto pr-5">
              <img
                onClick={openAvatarPopup}
                className="h-10 w-10 rounded-full cursor-pointer"
                src={user.avatar}
                alt=""
              />
              {avatarPopup && (
                <div
                  onClick={closeAvatarPopup}
                  className="fixed top-0 right-0 left-0 bottom-0 opacity-0 z-40"
                />
              )}
              {avatarPopup && (
                <div className="absolute -left-72 -bottom-34 z-50 w-80">
                  <AvatarPopup />
                </div>
              )}
            </div>

          </div>

        </ProtectedComponent>

      </div>
    </>
  );
};

export default Navbar;
