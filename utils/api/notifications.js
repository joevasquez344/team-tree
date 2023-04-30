import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export const notificationInviteListener = async () => {
  onSnapshot(collection(db, "notifications"), (snapshot) => {
    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    console.log('Notifications: ', notifications);
  });
};
