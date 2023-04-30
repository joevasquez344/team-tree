import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    setDoc,
    writeBatch,
    query,
    where,
    orderBy,
    updateDoc,
    serverTimestamp,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "../../firebase/config";

export const isTeamMember = async (teamId, authId) => {
  const ref = doc(db, `teams/${teamId}/users/${authId}`);
  const snapshot = await getDoc(ref);

  if (snapshot.id) return true;
  else return false;
};
export const isGroupMember = async (groupId, authId) => {
  const ref = doc(db, `groups/${groupId}/users/${authId}`);

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return true;
  else return false;
};
