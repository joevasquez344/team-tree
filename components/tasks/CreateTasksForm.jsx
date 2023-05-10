import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { createTask } from "../../utils/api/tasks";
import { useRouter } from "next/router";
import { getAuthsTeams } from "../../utils/api/teams";
import { fetchGroups } from "../../utils/api/group";

const CreateTasksForm = ({
  closeModal,
  setSubmitted,
  setInput,
  input,
  submitted,
  task,
}) => {
  const { authUser } = useAuth();

  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState(null);
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);

  const router = useRouter();

  const [header, setHeader] = useState("");
  const [selected, setSelected] = useState("");

  const route = router.pathname;

  const submitTasks = (e) => {
    e.preventDefault();

    if (input.length === 0) return;

    if (team !== null && group === null) {
      createTask(authUser, team, input);
      setSubmitted(true);
      closeModal();
    }

    if (team !== null && group !== null) {
      createTask(authUser, team, group, input);
      setSubmitted(true);
      closeModal();
    }
  };

  const selectTeam = async (teamId) => {
    const groups = await fetchGroups(teamId, authUser.id);
    const team = teams.find((team) => team.id === teamId);
    setTeam(team);
    if (groups.length === 0) {
      setHeader(`Create your task for team - ${team.name}`);

      return;
    }
    setGroups(groups);
    setHeader("Groups");
  };
  const selectGroup = async (groupId) => {
    const group = groups.find((group) => group.id === groupId);
    setGroup(group);
    setHeader(`Create your task for group - ${group.name}`);
  };

  console.log("router: ", router);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await getAuthsTeams();
      setTeams(teams);
      setHeader("Teams");
    };
    fetchData();
    // if (router.query.teamId) {
    //   setHeader(team.name);
    // }
    // if (router.query.groupId) {
    //   const group = groups.find((group) => group.id === router.query.groupId);
    //   setHeader(group.name);
    // }
  }, []);

  console.log("TassssK; ", task);

  return (
    <>
      <div className="mb-5">
        <div className="flex items-center justify-center">
          <div className="bg-blue-100 mb-5 rounded-lg inline-block px-5 py-1 font-bold absolute top-7 text-blue-400">
            {header}
          </div>
        </div>
        <div className="grid gap-4 grid-cols-12 ">
          {header === "Teams" && !submitted
            ? teams.map((team) => (
                <div
                  onClick={() => selectTeam(team.id)}
                  key={team.id}
                  className=" flex flex-col items-center justify-center col-span-3 cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-400 font-bold rounded-full">
                    T
                  </div>
                  <div className="text-gray-400 text-sm">{team.name}</div>
                </div>
              ))
            : header === "Groups" && !submitted
            ? groups.map((group) => (
                <div
                  onClick={() => selectGroup(group.id)}
                  key={group.id}
                  className=" flex flex-col items-center justify-center col-span-3 cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-400 font-bold rounded-full">
                    T
                  </div>
                  <div className="text-gray-400 text-sm text-center">
                    {group.name}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      {(header !== "Groups" && header !== "Teams" && header !== "") ||
        (submitted && (
          <form>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white  dark:bg-gray-800">
                <label for="editor" className="sr-only">
                  Publish post
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  id="editor"
                  rows="8"
                  className="block w-full px-0 text-sm text-gray-800 focus:outline-none bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="What are you working on today?"
                  required
                ></textarea>
              </div>
            </div>
            <button
              onClick={submitTasks}
              type="submit"
              className="inline-flex items-center px-10 py-2.5 text-sm font-medium text-center text-white bg-blue-400 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-600 transition ease-in-out duration-200"
            >
              Post
            </button>
          </form>
        ))}
    </>
  );
};

export default CreateTasksForm;
