import React, { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import { useRouter } from "next/router";
import { useTeams } from "../../../context/TeamsContext";

const useNavbar = () => {
  const router = useRouter();
  const { getTeams } = useTeams();
  const { notifications } = useAuth();

  const [avatarPopup, setAvatarPopup] = useState(false);
  const [notificationPopup, setNotificationPopup] = useState(false);
  const [teamsPopup, setTeamsPopup] = useState(false);
  const [teamHeader, setTeamHeader] = useState(null);

  const openAvatarPopup = () => setAvatarPopup(true);
  const closeAvatarPopup = () => setAvatarPopup(false);
  const openNotificationPopup = () => setNotificationPopup(true);
  const closeNotificationPopup = () => setNotificationPopup(false);

  const openTeamsPopup = () => setTeamsPopup(true);
  const closeTeamsPopup = () => setTeamsPopup(false);

  const onMount = async () => {
    const teams = await getTeams();
    const match = teams?.find((team) => team.id === router.query.teamId);
    if (match) setTeamHeader(match.name);
    else setTeamHeader("Teams");
  };

  const routeTeam = (team) => {
    router.push(`/teams/${team.id}`);
    setTeamsPopup(false);
    setTeamHeader(team.name);
  };
  const routeTeams = () => {
    router.push("/teams");
    setTeamsPopup(false);
  };

  return {
    avatarPopup,
    notificationPopup,
    teamsPopup,
    teamHeader,
    notifications,
    setAvatarPopup,
    setTeamsPopup,
    setTeamHeader,
    openAvatarPopup,
    closeAvatarPopup,
    openNotificationPopup,
    closeNotificationPopup,
    openTeamsPopup,
    closeTeamsPopup,
    onMount,
    routeTeam,
    routeTeams,
  };
};

export default useNavbar;
