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
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { fetchTeamChat, createTeamChat } from "./chat";
import { isTeamMember } from "./helpers";
import { sendTeamInvites } from "./invites";

const createTeam = async (authUser, teamName, authRole, inviteList) => {
  const userRef = doc(db, `users/${authUser.id}`);

  const createdTeam = await addDoc(collection(db, "teams"), {
    creator: userRef,
    creatorId: authUser.id,
    name: teamName,
  });

  await sendTeamInvites(inviteList, {
    id: createdTeam.id,
    name: teamName,
  });

  await setDoc(doc(db, `teams/${createdTeam.id}/users/${authUser.id}`), {
    role: authRole,
    username: authUser.username,
  });
  await setDoc(doc(db, `users/${authUser.id}/teams/${createdTeam.id}`), {
    role: authRole,
  });

  await createTeamChat(createdTeam.id);

  return {
    id: createdTeam.id,
    name: teamName,
  };

  // batch.set(doc(db, `teams/${createdTeam.id}/users/${authUser.id}`), {
  //   role: authRole,
  // });
  // batch.set(doc(db, `users/${authUser.id}/teams/${createdTeam.id}`));
};

// getTeamMessages is not longer in use, same with getGroupMessages, instead look down below
const getTeamById = async (id) => {
  const isMember = await isTeamMember(id, auth.currentUser.uid);

  if (!isMember) return false;

  const ref = doc(db, `teams/${id}`);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    let arr = [1];
    let team = { id: snapshot.id, ...snapshot.data() };

    team = await Promise.all(
      arr.map(async (item) => ({
        id: snapshot.id,
        ...snapshot.data(),
        members: await getTeamMembers(snapshot.id),
        // ------------ Here --------------
        chat: await fetchTeamChat("team", snapshot.id),
      }))
    );

    console.log("getTeamById(): ", team[0]);

    return team[0];
  } else {
    return false;
  }
};

const getAuthsTeams = async () => {
  const teamDocs = collection(db, `users/${auth?.currentUser?.uid}/teams`);
  const teamSnapshot = await getDocs(teamDocs);
  const teamIds = teamSnapshot.docs.map((d) => d.id);

  // if (teamIds.length === 0) {
  //   return false;
  // }

  let teams = await Promise.all(
    teamIds.map(async (id) => await getDoc(doc(db, `teams/${id}`)))
  );

  teams = teams?.map((team) => ({ id: team.id, ...team.data() }));

  return teams;
};

const addTeamMember = async (userId, teamId) => {
  const batch = writeBatch(db);

  const userRef = doc(db, `users/${userId}`);
  const teamRef = doc(db, `teams/${teamId}`);
  const teamUserRef = doc(db, `teams/${teamId}/users/${userId}`);
  const userTeamRef = doc(db, `users/${userId}/teams/${teamId}`);

  const userDoc = await getDoc(userRef);
  const teamDoc = await getDoc(teamRef);

  const teamSnapshot = teamDoc.data();
  const creatorId = teamSnapshot.creatorId;

  if (
    userDoc.exists() &&
    teamDoc.exists() &&
    creatorId === auth.currentUser.uid
  ) {
    batch.set(teamUserRef);
    batch.set(userTeamRef);
  } else {
    return alert("Team or User does not exist");
  }
};
const removeTeamMember = async (userId, teamId) => {
  const batch = writeBatch(db);

  const userRef = doc(db, `users/${userId}`);
  const teamRef = doc(db, `teams/${teamId}`);
  const teamUserRef = doc(db, `teams/${teamId}/users/${userId}`);
  const userTeamRef = doc(db, `users/${userId}/teams/${teamId}`);

  const userDoc = await getDoc(userRef);
  const teamDoc = await getDoc(teamRef);

  const teamSnapshot = teamDoc.data();
  const creatorId = teamSnapshot.creatorId;

  if (
    userDoc.exists() &&
    teamDoc.exists() &&
    creatorId === auth.currentUser.uid
  ) {
    batch.delete(teamUserRef);
    batch.delete(userTeamRef);
  } else {
    return alert("Team or User does not exist");
  }
};

const getGroupQuantity = async (teamId) => {
  const ref = collection(db, `groups`);
  const filter = query(ref, where("team", "==", teamId));
  const snapshot = await getDocs(filter);
  const groups = snapshot.docs.map((group) => group.id);

  return groups.length;
};

const getTeamMembersQuantity = async (teamId) => {
  const ref = collection(db, `teams/${teamId}/users`);
  const snapshot = await getDocs(ref);
  const users = snapshot.docs.map((user) => user.id);

  return users.length;
};
const getTeamMembers = async (teamId) => {
  const ref = collection(db, `teams/${teamId}/users`);
  const snapshot = await getDocs(ref);
  const userIds = snapshot.docs.map((doc) => doc.id);
  // .filter((doc) => doc.id !== auth.currentUser.uid)

  let users = await Promise.all(
    userIds.map(async (id) => await getDoc(doc(db, `users/${id}`)))
  );
  users = users.map((user) => ({ id: user.id, ...user.data() }));
  return users;
};

export {
  createTeam,
  getAuthsTeams,
  getTeamById,
  getGroupQuantity,
  getTeamMembersQuantity,
  addTeamMember,
  removeTeamMember,
  getTeamMembers,
};
