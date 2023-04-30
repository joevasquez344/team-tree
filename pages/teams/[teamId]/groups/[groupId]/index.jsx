import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getGroupById, getGroupUsers } from "../../../../../utils/api/group";
import ProtectedRoute from "../../../../../components/ProtectedRoute";
import Loader from "../../../../../components/Loader";
import { useAuth } from "../../../../../context/auth/AuthContext";

const GroupDetails = () => {
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(true);
  const { setAuthLayout } = useAuth();
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "Members",
      route: (id) => `/teams/${id}/groups`,
      active: true,
    },
    {
      id: 2,
      name: "Daily Tasks",
      route: (id) => `/teams/${id}/groups`,
      active: false,
    },
  ]);

  const router = useRouter();

  console.log("Router: ", router);

  const getGroup = async () => {
    const group = await getGroupById(router.query.groupId);
    const members = await getGroupUsers(router.query.groupId);

    setGroup(group);
    setMembers(members);
    setLoading(false);
  };

  const handleTabClick = (tabClicked) => {
    const activeTab = tabs.find((tab) => tab.active);
    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTab.id) {
        tab.active = false;
      }
      if (tab.id === tabClicked.id) {
        tab.active = true;
      }

      return tab;
    });
    setTabs(updatedTabs);
  };

  useEffect(() => {
    getGroup();
    setAuthLayout(true);
  }, [router.query.groupId]);
  return (
    <ProtectedRoute>
      <div className="flex px-7 space-x-3 items-center bg-gray-800 border-b border-b-gray-600">
        <div className=" pr-4 border-r border-r-gray-300 text-gray-300 font-semibold">{group?.name}</div>
        {router.query.teamId && (
          <div className="flex items-center h-12 bg-gray-800 font-semibold">
            {tabs?.map((tab) => (
              <div
                key={tab?.id}
                onClick={() => handleTabClick(tab)}
                className={`${
                  tab?.active ? " text-gray-300 bg-gray-700" : " text-gray-400"
                } hover:bg-gray-700  px-7 flex items-center justify-center h-full transition ease-in-out cursor-pointer duration-200`}
              >
                {tab?.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-700 h-screen">
          {members.map((user) => (
            <div className="border-b border-b-gray-600 px-7 py-3">
              <div className="flex  space-x-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <div>
                  <div className="flex items-center text-gray-400 space-x-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm">@{user.username}</div>
                  </div>
                  <div
                    className={`${
                      user.onlineStatus === "online"
                        ? "text-green-500"
                        : "text-red-500"
                    } font-semibold text-sm`}
                  >
                    {user.onlineStatus.charAt(0).toUpperCase() +
                      user.onlineStatus.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
};

export default GroupDetails;
