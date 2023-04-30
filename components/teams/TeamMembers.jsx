import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import CollapseButton from "../buttons/CollapseButton";
import ExpandButton from "../buttons/ExpandButton";
import Avatar from "../users/Avatar";
import { useTeams } from "../../context/TeamsContext";

const TeamMembers = () => {
  const { authUser } = useAuth();
  const { teamMembers, team } = useTeams();

  return (
    <div className="w-full bg-gray-700 h-screen">
      {teamMembers.map((user) => (
        <div className="border-b border-b-gray-600 px-7 py-3">
          <div className="flex  space-x-3">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <div>
              <div className="flex items-center text-gray-400 space-x-1">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm">@{user.username}</div>
              </div>
              <div
                className={`${
                  user.onlineStatus === "online"
                    ? "text-green-500"
                    : "text-red-500"
                } font-semibold text-sm`}
              >
                {user.onlineStatus.charAt(0).toUpperCase() + user.onlineStatus.slice(1)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
