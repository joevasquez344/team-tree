import React, { useEffect, useState } from "react";
import TeamsHeader from "../../../components/teams/TeamsHeader";
import { getAuthsTeams, getTeamById } from "../../../utils/api/teams";
import { useRouter } from "next/router";
import Groups from "../../../components/groups/Groups";
import { useAuth } from "../../../context/auth/AuthContext";
import { ThreeCircles } from "react-loader-spinner";
import Loader from "../../../components/Loader";
import { useTeams } from "../../../context/TeamsContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import SidebarContainer from "../../../components/layout/Sidebar/SidebarContainer";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import Cards from "../../../components/cards/Cards";
import UserCards from "../../../components/users/UserCards";
import TeamMembers from "../../../components/teams/TeamMembers";
import Members from "../../../components/users/Members";
import Chat from "../../../components/Chat/Chat";
// export const getStaticPaths: GetStaticPaths = async () => {
//     const teams = await getAuthsTeams();

//     const paths = teams.map(team => {
//         return {
//             params: { id: team?.id }
//         }
//     })

//     return {
//         paths,
//         fallback: false
//     }
// }
// export const getStaticProps: GetStaticProps = async (context) => {

//     const team = await getTeamById(context?.params?.id)
//     // const tasks = await getUsersTasks(user.id)

//     return {
//         props: { team }
//     }
// }

const Team = () => {
  const router = useRouter();
  const { setAuthLayout } = useAuth();
  const { team, error, getTeam, teamLoading, teamMembers } = useTeams();
  const [messages, setMessages] = useState([]);

  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "Members",
      active: true,
    },
    {
      id: 2,
      name: "Daily Tasks",
      active: false,
    },
    {
      id: 3,
      name: "Chat",
      route: `/teams/${router.query.teamId}/chat`,
      active: false,
    },
  ]);

  const handleTabClick = (tabClicked) => {
    const activeTab = tabs.find((tab) => tab.active);
    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTab.id) {
        tab.active = false;
      }
      if (tab.id === tabClicked.id) {
        tab.active = true;
        if (tab.route) {
          router.push(tab.route);
        }
      }

      return tab;
    });
    setTabs(updatedTabs);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTeam();
      setAuthLayout(true);
    };
    fetchData();

    const activeTab = tabs.find((tab) => tab.active);
    const updatedTabs = tabs.map((tab) => {
      if (tab.id === activeTab.id) {
        tab.active = false;
      }
      if (tab.id === 1) {
        tab.active = true;
      }

      return tab;
    });
    setTabs(updatedTabs);
  }, [router.query.teamId]);

  return (
    <ProtectedRoute>
      <>
        {teamLoading ? (
          <div className="w-full h-full flex relative">
            <Loader />
          </div>
        ) : (
          <div className="w-full">
            <div className="hidden sm:block">
              <TeamsHeader tabs={tabs} tabClick={handleTabClick} />
            </div>
            {error === 404 ? (
              <div className=" h-screen flex justify-center mt-64">
                <div>
                  <div className="text-8xl text-center mb-12">404</div>
                  <div className="text-6xl">Page Not Found</div>
                </div>
              </div>
            ) : (
              <div className="flex w-full">
                <DynamicContainer tabs={tabs} />
                <div className="border-l h-screen w-96 hidden lg:block">
                  <Members members={teamMembers} />
                </div>
              </div>

              // <Groups />
            )}
          </div>
        )}
      </>
    </ProtectedRoute>
  );
};

const DynamicContainer = ({ tabs, messages }) => {
  const activeTab = tabs.find((tab) => tab.active === true);

  useEffect(() => {
    console.log("New Tabs: ", tabs);
    const activeTab = tabs.find((tab) => tab.active === true);
    if (activeTab.name === "Members") {
    }
  }, [tabs]);

  if (activeTab.name === "Members") {
    return <TeamMembers />;
  }
  if (activeTab.name === "Daily Tasks") {
    return <div className="w-full bg-white">Daily Tasks</div>;
  }

  if (activeTab.name === "Chat") {
    return <Chat messages={messages} />;
  }

  if (
    activeTab.name !== "Members" ||
    activeTab.name !== "Daily Tasks" ||
    activeTab.name !== "Chat"
  ) {
    return <TeamMembers />;
  }
};

export default Team;
