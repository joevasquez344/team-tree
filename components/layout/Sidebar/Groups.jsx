import React, { useState } from "react";
import { useTeams } from "../../../context/TeamsContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Popup from "../../Popup";
import CreateGroupMessage from "../../groups/CreateGroupMessage";
import { useRouter } from "next/router";

const Groups = ({ groupsLoading, groups, openPopup, team }) => {
  // const { groupsLoading, groups } = useTeams();
  const [popup, setPopup] = useState(false);
  const router = useRouter();
  return (
    <div className="border-b border-b-gray-600 pb-5">
      <div className="flex items-center relative justify-between pl-3 pr-2 mb-2 py-1 text-gray-300 text-sm">
        <div className="font-bold">Groups</div>
        <div onClick={openPopup} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>
      {groupsLoading ? (
        <div className="mx-5">
          <Skeleton
            className="mb-3"
            baseColor="rgb(31 41 55)"
            highlightColor="rgb(55 65 81)"
            count={10}
            enableAnimation={true}
            direction="rtl"
            duration={1}
          />
        </div>
      ) : (
        <div className="px-3">
          {groups.length === 0 ? (
            <CreateGroupMessage openPopup={openPopup} />
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                onClick={() =>
                  router.push(`/teams/${team.id}/groups/${group.id}/chat`)
                }
                className={`flex items-center justify-between  text-sm ${
                  group.id === router.query.groupId
                    ? "bg-gray-900 text-gray-300"
                    : "text-gray-500"
                } hover:bg-gray-700  px-3 py-2 transition ease-in-out cursor-pointer duration-200`}
              >
                <div className="font-semibold">{group.name}</div>
                {group.id === router.query.groupId && (
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
