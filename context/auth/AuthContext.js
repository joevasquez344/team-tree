import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { db, auth } from "../../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  clockIn,
  clockOut,
  createUser,
  getUserById,
} from "../../utils/api/users";
import { useRouter } from "next/router";
import { getAuthsTeams, getUserGroups } from "../../utils/api/teams";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authTeams, setAuthTeams] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [theme, setTheme] = useState({});
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState(null);
  const [sentInvites, setSentInvites] = useState([]);
  const [authLayout, setAuthLayout] = useState(false);

  const userInfo = useRef();
  const router = useRouter();

  const getAuthTeams = async () => {
    const teams = await getAuthsTeams();
    
    if (teams === false) {
      setAuthTeams([]);
      setLoading(false);

      return;
    }

    setAuthTeams(teams);
    setLoading(false);

    return teams;
  };

  const getTeamGroups = async (team) => {
    setGroupsLoading(true);

    const groups = await getUserGroups(team.id);
    setGroups(groups);
    setGroupsLoading(false);
  };

  const register = async (form) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
    if (userCredentials) {
      const data = {
        id: userCredentials.user.uid,
        email: form.email,
        name: form.displayname,
        username: form.username,
        position:
          form.position === "Create Position"
            ? form.customposition
            : form.position,
      };

      await createUser(data);

      const user = await getUserById(userCredentials.user.uid);
      if (user.id) {
        setAuthUser(user);
     
      }
    }
  };

  const login = async (email, password) => {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredentials) {
      const user = await getUserById(userCredentials.user.uid);
      const teams = await getAuthsTeams();
      console.log('teams: ', teams)
      if (user.id) {
        setAuthUser(user);
        router.push(`/teams/${teams[0]?.id}/chat`);
      }
    }
  };

  const logout = () => {
    signOut(auth);
    setAuthUser(null);
    router.push("/");
  };

  const updateUserState = (data) => {
    setAuthUser({ ...authUser, ...data });
  };

  const goOnline = async () => {
    const time = await clockIn(authUser.id);
    setAuthUser({
      ...authUser,
      onlineStatus: "online",
      onlineHistory: [...authUser.onlineHistory, time],
    });
  };

  const goOffline = async () => {
    const time = await clockOut(authUser.id);
    setAuthUser({
      ...authUser,
      onlineStatus: "offline",
      onlineHistory: [...authUser.onlineHistory, time],
    });
  };

  const handleTheme = (authTheme) => {
    const themes = {
      red: {
        primary: "red-400",
        secondary: "red-300",
        light: "red-100",
      },
      blue: {
        primary: "blue-500",
        secondary: "blue-400",
        light: "blue-100",
      },
      green: {
        primary: "green-500",
        secondary: "green-400",
        light: "green-100",
      },
    };

    if (authTheme === "blue") {
      setTheme(themes.blue);
    }
    if (authTheme === "green") {
      setTheme(themes.green);
    }
    if (authTheme === "red") {
      setTheme(themes.red);
    }
    if (!authTheme || authTheme === "") {
      setTheme(themes.blue);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredentials) => {
      if (userCredentials) {
        const user = await getUserById(userCredentials.uid);
        setAuthUser(user);
        onSnapshot(
          collection(db, `users/${userCredentials.uid}/invites`),
          (snapshot) => {
            const notifications = [];
            snapshot.forEach((doc) => {
              notifications.push({ id: doc.id, ...doc.data(), type: "invite" });
            });
            setNotifications(notifications);
          }
        );

        // onSnapshot(collection(db, "users"), (snapshot) => {
        //   const users = [];
        //   snapshot.forEach((doc) => {
        //     users.push({ id: doc.id, ...doc.data() });
        //   });
        // });
        setLoading(false);
      } else {
        // logout();
        setAuthUser(null)
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    authUser,
    register,
    login,
    logout,
    userInfo,
    updateUserState,
    goOnline,
    goOffline,
    getAuthTeams,
    setAuthTeams,
    authTeams,
    theme,
    getTeamGroups,
    groupsLoading,
    groups,
    notifications,
    setGroups,
    setSentInvites,
    sentInvites,
    setAuthLayout,
    authLayout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
