import React from "react";
import { useTeams } from "../../../context/TeamsContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "@material-tailwind/react";
import { useRouter } from "next/router";

const Teams = () => {
  const { teamsLoading, teams } = useTeams();
  const router = useRouter();
  return (
    <div className="mt-3">
      {" "}
      {teamsLoading ? (
        <Skeleton
          className="mb-3"
          baseColor="rgb(96 165 250)"
          width="56px"
          height="56px"
          borderRadius="500px"
          count={10}
          enableAnimation={true}
          direction="rtl"
          duration={1}
        />
      ) : (
        <div className="flex flex-col">
          {" "}
          {teams.map((team) => (
            <Tooltip
              placement="right"
              content={team.name}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 1 },
              }}
              className="hidden sm:flex px-3 py-2  rounded-md text-xs text-blue-400 font-bold bg-white z-50"
            >
              <div onClick={() => router.push(`/teams/${team.id}`)} key={team.id} className="w-full mb-3">
                {team.avatar ? (
                  <img
                    className="h-14 w-14 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                ) : (
                  <div className="bg-blue-400 rounded-full w-14 h-14 flex justify-center items-center cursor-pointer">
                    <div className="text-white font-bold text-lg">
                      {team.name.split("")[0].toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
