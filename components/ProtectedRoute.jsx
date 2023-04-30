import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import { useTeams } from "../context/TeamsContext";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { authUser, authLayout, setAuthLayout } = useAuth();
  const { teams } = useTeams();

  useEffect(() => {
    const route = router.pathname;

    if (!authUser) {
      router.push("/");
    }

    if (
      authUser &&
      (route === "/" || route === "/login" || route === "/register")
    ) {
      if (teams.length > 0) {
        router.push(`/teams/${teams[0].id}`);
        return;
      }
      router.push(`/profile/${authUser.username}`);
    }
  }, [authUser]);

  return <div>{authUser ? children : null}</div>;
};

export default ProtectedRoute;
