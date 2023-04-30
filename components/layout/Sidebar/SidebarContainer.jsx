import React, { useEffect } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import useCreateTeam from "../../../hooks/useCreateTeam2";
import { getAuthsTeams } from "../../../utils/api/teams";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";

const SidebarContainer = () => {
  const { authUser, authLayout } = useAuth();
  const { teams, setTeams } = useCreateTeam();

  const getTeams = async () => {
    const teams = await getAuthsTeams();
    setTeams(teams);

    console.log("SIDEBAR - Auths Teams: ", teams);
  };

  useEffect(() => {
    getTeams();
  }, []);

  if (authUser && authLayout)
    return (
      <>
        <div className="hidden sm:block sm:col-span-3 2xl:col-span-2 ">
          <Sidebar teams={teams} />
        </div>
        <div className="z-50 absolute top-0 left-0 bottom-0 right-10 sm:hidden">
          <MobileSidebar teams={teams} />
        </div>
      </>
    );
};

export default SidebarContainer;
