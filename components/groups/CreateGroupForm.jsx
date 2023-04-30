import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import { createGroup } from "../../utils/api/teams";
import AddButton from "../buttons/AddButton";
import useCreateGroup from '../../hooks/useCreateGroup';

const CreateGroupForm = ({ team }) => {
  const router = useRouter();
  const { authUser, getTeamGroups } = useAuth();
  const { getGroups } = useTeams();
  const [error, setError] = useState(null);

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

  // const [form, setForm] = useState({
  //   role: "",
  //   custom: "",
  //   name: "",
  // });

  // const handleInputChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.currentTarget.name.toLowerCase()]: e.currentTarget.value,
  //   });
  // };
  // const validateForm = () => {
  //   if (form.name.length === 0) {
  //     return false;
  //   } else {
  //     if (form.role === "Create Role" && form.custom.length === 0) {
  //       return false;
  //     }
  //   }

  //   return true;
  // };

  // console.log("Form role: ", form.role);

  // const handleCreateGroup = async () => {

  //   if (validateForm()) {
  //     const role = form.role === "Create Role" ? form.custom : form.role;

  //     await createGroup(authUser, form.name, role, team);
  //     router.push(`/teams/${team.id}`)
  //     getGroups(team);
  //     router.reload(window.location.pathname)
  //   } else {
  //     console.log("Error");
  //   }
   
  // };

  useEffect(() => {
 
  }, []);
  return (
   
      <div className="py-5 w-[500px]">
        <div className="w-full">
          <form className="bg-white rounded mx-auto mb-6">
            <div className="flex space-x-3 px-5 mb-4 border-b pb-4 shadow">
              <div className="">
                <label className="block text-gray-400 font-semibold text-sm mb-2">
                  Team Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder=""
                />
              </div>
              <div className="">
                <label className="block text-gray-400 text-sm font-semibold mb-2">
                  Team Role
                </label>
                <select
                  onChange={handleInputChange}
                  value={form.role}
                  className="  border rounded w-full font-semibold py-2 px-3 text-gray-400 cursor-pointer leading-tight focus:outline-none focus:shadow-outline "
                  name="Role"
                  id=""
                >
                  <option
                    className="font-semibold"
                    name="role"
                    value="Project Manager"
                  >
                    Project Manger
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Senior Front End Developer"
                  >
                    Senior Front End Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Senior Back End Develope"
                  >
                    Senior Back End Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Senior Full Stack Developer"
                  >
                    Senior Full Stack Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Junior Front End Developer"
                  >
                    Junior Front End Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Junior Back End Developer"
                  >
                    Junior Back End Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Junior Full Stack Developer"
                  >
                    Junior Full Stack Developer
                  </option>
                  <option
                    className="font-semibold"
                    name="role"
                    value="Create Role"
                  >
                    Create Role
                  </option>
                </select>
                {form.role === "Create Role" && (
                  <div className="mt-4">
                    <input
                      name="custom"
                      value={form.custom}
                      onChange={handleInputChange}
                      className="shadow  border rounded w-full py-2 px-3 text-gray-400 font-semibold outline-none"
                      type="text"
                      placeholder="What role would you like?"
                    />
                  </div>
                )}
              </div>
            </div>
  
            <div className="mb-8 px-5">
              <div className="relative">
                <input
                  value={searchInput}
                  onChange={handleSearchInput}
                  className="border rounded py-1 px-3 w-full outline-none"
                  type="text"
                  placeholder="Find User By Email"
                />
                <div
                  onClick={() => searchUser(searchInput)}
                  className="absolute right-0 top-0 bg-blue-400 text-white font-semibold h-full flex items-center justify-center px-3 cursor-pointer"
                >
                  Find
                </div>
              </div>
              <div className="text-red-500 mt-2"> {searchedUserError}</div>
              <div className="mt-4 pb-3 border-b">
                <div className="text-gray-400  ">Invite List</div>
                {inviteList.map((user) => (
                  <div className="flex items-center justify-between rounded  p-2">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <img
                        className="h-6 w-6 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <div className="group-hover:text-blue-400 font-semibold">
                        {user.name}
                      </div>
                      <div className="group-hover:text-blue-400">
                        @{user.username}
                      </div>
                    </div>
                    <div
                      onClick={() => removeUserFromInviteList(user)}
                      className="w-7 h-7 flex items-center justify-center group hover:bg-red-100 rounded-full transition ease-in-out cursor-pointer duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
  
                    {/* <div className="text-sm bg-gray-100 text-gray-400 py-1 px-3">
                       Connect
                      </div> */}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-2 text-gray-400 font-semibold">
                  Suggested - Position - {authUser.position}
                </div>
                {suggestedUsers.map((user) => (
                  <div className="flex items-center justify-between rounded group p-2 hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <img
                        className="h-6 w-6 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <div className="group-hover:text-blue-400 font-semibold">
                        {user.name}
                      </div>
                      <div className="group-hover:text-blue-400">
                        @{user.username}
                      </div>
                    </div>
                    {/* <div className="text-sm bg-gray-100 text-gray-400 py-1 px-3">
                        Connect
                       </div> */}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-4 px-5">
              <button
                onClick={() => handleCreateGroup(team)}
                className="bg-blue-400 text-white rounded font-bold py-2 px-4 hover:text-blue-400 p-2 hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                type="button"
              >
                {inviteList.length > 0
                  ? "Create Team & Send Invites"
                  : "Create Team"}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 Acme Corp. All rights reserved.
          </p>
        </div>
      </div>
  );
};

export default CreateGroupForm;
