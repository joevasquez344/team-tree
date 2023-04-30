import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import CollapseButton from "../buttons/CollapseButton";
import ExpandButton from "../buttons/ExpandButton";
import Avatar from "./Avatar";

const AvatarRow = ({ openDropdown, closeDropdown, dropdown, group }) => {
  const { authUser } = useAuth();

  const joined = group.users.find((user) => user.id === authUser.id);
  const authIsCreator = group.creatorId === authUser.id;

  return (
    <div className={` px-5 xl:px-0 py-3 bg-white ${!dropdown && "border-b"}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center py-2">
          {joined && (
            <span className=" text-gray-500 font-semibold mr-1 text-xs bg-gray-100 px-2">
              Joined
            </span>
          )}

          <span className="text-gray-400 font-bold mr-6">{group.name}</span>
        </div>
        <div className={`font-semibold flex items-center space-x-5`}>
          {authIsCreator && (
            <div className="text-sm py-1 px-4 bg-blue-100 text-blue-400 transition ease-in-out cursor-pointer duration-200">
              Disband
            </div>
          )}
          <div className="text-sm ">
            {joined ? (
              <div className="  py-1 px-4 bg-blue-100 text-blue-400 transition ease-in-out cursor-pointer duration-200">
                Leave
              </div>
            ) : (
              <div>Join</div>
            )}
          </div>

          <div className="cursor-pointer">
            {dropdown ? (
              <div onClick={closeDropdown}>
                <CollapseButton color="gray" />
              </div>
            ) : (
              <div onClick={openDropdown}>
                <ExpandButton />
              </div>
            )}
          </div>
        </div>
      </div>
      <>
        {group.users.map((user) => (
          <Avatar user={user} />
        ))}
      </>
    </div>
  );
};

export default AvatarRow;
