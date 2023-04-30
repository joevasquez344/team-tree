import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import { useTeams } from "../../../context/TeamsContext";
import AddButton from "../../buttons/AddButton";
import FilterButton from "../../buttons/FilterButton";
import Avatar from "../../users/Avatar";
import CreateTeamForm from "../../../components/forms/CreateTeamForm";
import Teams from "./Teams";
import Groups from "./Groups";
import Popup from "../../Popup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "@material-tailwind/react";
import TeamsPopup from "../../teams/TeamsPopup";
import ModalOverlay from "../ModalOverlay";
import Button from "../../buttons/Button";
import CollapseButton from "../../buttons/CollapseButton.tsx";
import ExpandButton from "../../buttons/ExpandButton";
import ProtectedComponent from "../../ProtectedComponent";
import {
  getAuthsTeams,
  getTeamById,
  getTeamGroups,
  getUserGroups,
} from "../../../utils/api/teams";
import useCreateTeam from "../../../hooks/useCreateTeam2";
import useCreateGroup from "../../../hooks/useCreateGroup";

import CreateGroupForm from "../../forms/CreateGroupForm";
import Members from "../../users/Members";

const Sidebar = ({ teams }) => {
  // const {
  //   teams,
  //   team,
  //   groups,
  //   getTeams,
  //   getGroups,
  //   teamsLoading,
  //   groupsLoading,
  // } = useTeams();
  const router = useRouter();
  const { authLayout } = useAuth();
  const [teamHeader, setTeamHeader] = useState(null);
  const [popup, setPopup] = useState(false);
  const [teamsPopup, setTeamsPopup] = useState(false);
  // const [createGroupPopup, setCreateGroupPopup] = useState(false);
  // const [createTeamPopup, setCreateTeamPopup] = useState(false);

  const { createTeamPopup, setCreateTeamPopup } = useCreateTeam();
  const {
    form,
    handleInputChange,
    handleCreateGroup,
    fetchUsersByPosition,
    suggestedUsers,
    removeUserFromInviteList,
    inviteList,
    searchInput,
    searchUser,
    handleSearchInput,
    searchedUser,
    searchedUserError,
    groups,
    setGroups,
    createGroupPopup,
    setCreateGroupPopup,
  } = useCreateGroup();
  const [team, setTeam] = useState({});

  const [teamLoading, setTeamLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const getTeam = async () => {
    setCreateGroupPopup(false);
    const team = await getTeamById(router.query.teamId);
    if (team === false) {
      setGroupsLoading(false);
      setTeam(null);
      setTeamHeader("Select Team");
      setTeamLoading(false);
      return;
    }
    getGroups();
    setTeam(team);
    setTeamHeader(team.name);
    setTeamLoading(false);
  };

  const getGroups = async () => {
    const groups = await getTeamGroups(router.query.teamId);

    setGroups(groups);
    setGroupsLoading(false);
  };

  const routeTeam = (teamId) => {
    router.push(`/teams/${teamId}/chat`);
    setTeamsPopup(false);
  };
  const toggleTeamsDropdown = () => {
    if (teamsPopup) setTeamsPopup(false);
    else setTeamsPopup(true);
  };

  // Intended Functionality working but severly needs code rework to not keep refeching everytime the team & group Ids change
  // especially when creating a new team or group routes to the new created Id (refetches because of dependencies in useEffect)
  useEffect(() => {
    const fetchData = async () => {
      getTeam();
      setCreateTeamPopup(false);
      setTeamsPopup(false);
    };

    fetchData();
  }, [router.query.teamId, router.query.groupId]);

  return (
    <ProtectedComponent>
      <div className="relative flex flex-col w-full bg-gray-800 h-screen  space-y-2">
        {groupsLoading ? (
          <div className="mx-5">
            {" "}
            <Skeleton
              className=" mt-3 h-6"
              baseColor="rgb(31 41 55)"
              highlightColor="rgb(55 65 81)"
              count={1}
              // height="16px"
              enableAnimation={true}
              direction="rtl"
              duration={1}
            />
          </div>
        ) : (
          <div
            onClick={toggleTeamsDropdown}
            className="text-gray-300 font-semibold h-12 px-3 bg-gray-800 py-1 mb-3 shadow-md hover:bg-gray-700 flex items-center justify-between transition ease-in-out cursor-pointer duration-200"
          >
            {teamHeader}
            {teamsPopup ? (
              <CollapseButton height="4" width="4" />
            ) : (
              <ExpandButton height="4" width="4" />
            )}
          </div>
        )}
        {teamsPopup && (
          <div className="text-sm border-b border-b-gray-600  bg-gray-800">
            <div className="w-full flex flex-col  bg-gray-800 px-3 pb-5">
              <div className="flex flex-col space-y-3 group">
                {teams.map((team) => (
                  <div key={team.id} onClick={() => routeTeam(team.id)}>
                    <Button text={team.name} theme="blue" />
                  </div>
                ))}
              </div>
            </div>
            {createTeamPopup && (
              <div
                onClick={() => setCreateTeamPopup(false)}
                className="fixed top-0 right-0 left-0 bottom-0 opacity-0 z-40 bg-black cursor-default"
              />
            )}
            {createTeamPopup && (
              <div className="absolute z-50 shadow-lg  bg-white left-[425px]">
                <CreateTeamForm />
              </div>
            )}
            <div
              onClick={() => setCreateTeamPopup(true)}
              // onClick={handleCreateTeam}
              className="px-3 relative flex items-center group mx-3  py-2 mb-3 space-x-3  hover:bg-gray-700 text-gray-300   transition ease-in-out cursor-pointer duration-200"
            >
              <AddButton height="4" width="4" />
              <div className="text-gray-300 font-semibold w-3/4 flex justify-between items-center transition ease-in-out cursor-pointer duration-200">
                Create Team
              </div>
            </div>
          </div>
        )}

        {team !== null && (
          <>
            {" "}
            <>
              {" "}
              <Groups
                groups={groups}
                groupsLoading={groupsLoading}
                openPopup={() => setCreateGroupPopup(true)}
                team={team}
              />
              {createGroupPopup && (
                <div
                  onClick={() => setCreateGroupPopup(false)}
                  className="fixed top-0 right-0 left-0 bottom-0 z-40"
                ></div>
              )}
              {createGroupPopup && (
                <div className="absolute -right-[500px] bg-white z-50 shadow w-[500px]">
                  <CreateGroupForm team={team} />
                </div>
              )}
            </>
            <div>
              <div className="flex items-center relative justify-between pl-3 pr-2 mb-2 py-1 text-gray-300 text-sm">
                <div className="font-bold">Direct Messages</div>
                <div className="cursor-pointer">
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
              <div>
                <div className="px-3">
                  <Members members={team.members} type="chat" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedComponent>
  );
};

export default Sidebar;
