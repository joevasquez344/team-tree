import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth/AuthContext";
import { getUserByEmail, getUsersByPosition } from "../utils/api/users";
import { createTeam } from "../utils/api/teams";
import { useTeams } from "../context/TeamsContext";

const useCreateTeam = () => {
  const router = useRouter();
  const { authUser, setSentInvites, sentInvites, setAuthLayout } = useAuth();
  const {setTeams, teams} = useTeams()
  const [allUsers, setAllUsers] = useState([]);
  const [inviteList, setInviteList] = useState([]);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchedUserError, setSearchedUserError] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [form, setForm] = useState({
    role: "",
    custom: "",
    name: "",
  });

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.currentTarget.name.toLowerCase()]: e.currentTarget.value,
    });
  };
  const validateForm = () => {
    if (form.name.length === 0) {
      return false;
    } else {
      if (form.role === "Create Role" && form.custom.length === 0) {
        return false;
      }
    }

    return true;
  };

  const searchUser = async (email) => {
    const inInviteList = inviteList.find((user) => user.email === email);
    const isAuthEmail = email === authUser.email;
    if (inInviteList) {
      setSearchedUserError("User already in invite list");
      return;
    }

    if (isAuthEmail) {
      setSearchedUserError("Cannot search your own email");
      return;
    }

    const response = await getUserByEmail(email);

    if (response.error === true && response.errorCode === 1001) {
      setSearchedUserError(response.payload);
    }
    if (response.error === false) {
      setInviteList([response.payload, ...inviteList]);
      setSearchInput("");
      setSearchedUserError(null);
    }
  };

  const removeUserFromInviteList = (user) => {
    setInviteList(inviteList.filter((u) => u.id !== user.id));
  };

  const handleCreateTeam = async () => {
    if (validateForm()) {
      const role = form.role === "Create Role" ? form.custom : form.role;
      const createdTeam = await createTeam(
        authUser,
        form.name,
        role,
        inviteList
      );
      setSentInvites([...inviteList, ...sentInvites]);
      setTeams([...teams, createdTeam]);
      setAuthLayout(true)
      router.push(`/teams/${createdTeam.id}`);
    } else {
      console.log("Error");
    }
  };

  const fetchUsersByPosition = async (position) => {
    const users = await getUsersByPosition(position);
    setSuggestedUsers(users);

    return users;
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    // const searchResults = allUsers.filter(
    //   (user) =>
    //     user.username.toLowerCase().match(e.target.value.toLowerCase()) ||
    //     user.username.toUpperCase().match(e.target.value.toUpperCase()) ||
    //     user.name.toUpperCase().match(e.target.value.toUpperCase()) ||
    //     user.name.toUpperCase().match(e.target.value.toUpperCase())
    // );

    // setSearchedUsers(searchResults);
  };
  return {
    form,
    handleInputChange,
    handleCreateTeam,
    fetchUsersByPosition,
    suggestedUsers,
    removeUserFromInviteList,
    inviteList,
    searchInput,
    searchUser,
    handleSearchInput,
    searchedUser,
    searchedUserError,
  };
};

export default useCreateTeam;
