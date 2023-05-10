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

export const sendTeamInvites = async (inviteList, team, authId) => {
  await Promise.all(
    inviteList.map(
      async (user) =>
        await addDoc(collection(db, "invites"), {
          from: authId,
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
          from: authId,
          to: user.id,
          status: "pending",
          target: "team",
        })
    )
  );
};

export const acceptTeamInvite = async (inviteId, authId) => {
  await updateDoc(doc(db, `invites/${inviteId}`), {
    status: "accepted",
  });
  await updateDoc(
    doc(db, `users/${authId}/invites/${inviteId}`),
    {
      status: "accepted",
    }
  );
};
export const declineTeamInvite = async (inviteId, authId) => {
  await updateDoc(doc(db, `invites/${inviteId}`), {
    status: "declined",
  });
  await updateDoc(
    doc(db, `users/${authId}/invites/${inviteId}`),
    {
      status: "declined",
    }
  );
};
