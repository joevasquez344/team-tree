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
import { db, auth } from "../../firebase/config";

export const sendTeamInvites = async (inviteList, team) => {
  await Promise.all(
    inviteList.map(
      async (user) =>
        await addDoc(collection(db, "invites"), {
          from: auth.currentUser.uid,
          to: user.id,
          status: "pending",
          target: "team",
          team,
        })
    )
  );
  await Promise.all(
    inviteList.map(
      async (user) =>
        await addDoc(collection(db, `users/${user.id}/invites`), {
          from: auth.currentUser.uid,
          to: user.id,
          status: "pending",
          target: "team",
        })
    )
  );
};

export const acceptTeamInvite = async (inviteId) => {
  await updateDoc(doc(db, `invites/${inviteId}`), {
    status: "accepted",
  });
  await updateDoc(
    doc(db, `users/${auth.currentUser.uid}/invites/${inviteId}`),
    {
      status: "accepted",
    }
  );
};
export const declineTeamInvite = async (inviteId) => {
  await updateDoc(doc(db, `invites/${inviteId}`), {
    status: "declined",
  });
  await updateDoc(
    doc(db, `users/${auth.currentUser.uid}/invites/${inviteId}`),
    {
      status: "declined",
    }
  );
};
