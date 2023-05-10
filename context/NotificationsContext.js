import React, { useContext, createContext, useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
// import { clockIn, clockOut, getUserById } from '../../utils/api/users';
import { useRouter } from "next/router";
import { getAuthsTeams, getTeamById, getUserGroups } from "../utils/api/teams";
import { useAuth } from "./auth/AuthContext";

const NotificationsContext = createContext();

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }) {
  const { authUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("to", "==", authUser.id)
    );
    onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      console.log("Notifications: ", notifications);
      setNotification(notifications);
    });
  }, []);

  const value = { notification, notifications };

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}
