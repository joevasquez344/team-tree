import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddButton from "../components/buttons/AddButton";
import CreateTeamForm from "../components/forms/CreateTeamForm";
import { useAuth } from "../context/auth/AuthContext";
import { useTeams } from "../context/TeamsContext";
import { createTeam } from "../utils/api/teams";
import ProtectedRoute from "../components/ProtectedRoute";

const createteam = () => {
  return (
    <ProtectedRoute>
      <CreateTeamForm />
    </ProtectedRoute>
  );
};

export default createteam;
