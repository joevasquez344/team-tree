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
import { fetchGroupChat } from "./chat";
import { isGroupMember } from "./helpers";

export const createGroup = async (
  authUser,
  groupName,
  role,
  team,
  inviteList
) => {
  const userRef = doc(db, `users/${authUser.id}`);

  const createdGroup = await addDoc(collection(db, "groups"), {
    creator: userRef,
    creatorId: authUser.id,
    team: doc(db, `teams/${team.id}`),
    name: groupName,
  });

  await setDoc(doc(db, `teams/${team.id}/groups/${createdGroup.id}`), {});
  await setDoc(doc(db, `groups/${createdGroup.id}/users/${authUser.id}`), {
    role,
  });
  await setDoc(doc(db, `users/${authUser.id}/groups/${createdGroup.id}`), {});
  await setDoc(
    doc(db, `users/${authUser.id}/teams/${team.id}/groups/${createdGroup.id}`),
    {}
  );
  await createGroupChat(createdGroup.id);

  return {
    id: createdGroup.id,
    name: groupName,
  };
};

export const getTeamGroups = async (teamId) => {
  const groupsRef = collection(db, `teams/${teamId}/groups`);
  const snapshot = await getDocs(groupsRef);
  const groupIds = snapshot.docs.map((d) => d.id);
  let groups = await Promise.all(
    groupIds.map(async (id) => await getDoc(doc(db, `groups/${id}`)))
  );

  return groups.map((group) => ({ id: group.id, ...group.data() }));
};

export const fetchGroups = async (teamId) => {
  const groupsRef = collection(
    db,
    `users/${auth.currentUser.uid}/teams/${teamId}/groups`
  );
  const snapshot = await getDocs(groupsRef);
  const groupIds = snapshot.docs.map((d) => d.id);
  let groups = await Promise.all(
    groupIds.map(async (id) => await getDoc(doc(db, `groups/${id}`)))
  );

  return groups.map((group) => ({ id: group.id, ...group.data() }));
};

export const getGroupById = async (groupId) => {
  const isMember = await isGroupMember(groupId, auth.currentUser.uid);
  if (!isMember) return;

  const ref = doc(db, `groups/${groupId}`);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
      members: await getGroupUsers(groupId),
      chat: await fetchGroupChat(groupId),
    };
  }
};

export const addGroupMember = async (userId, teamId, groupId) => {
    const batch = writeBatch(db);
    const authId = auth.currentUser.uid;
  
    const userRef = doc(db, `users/${userId}`);
    const teamRef = doc(db, `teams/${teamId}`);
    const groupRef = doc(db, `groups/${groupId}`);
    const teamUserRef = doc(db, `teams/${teamId}/users/${userId}`);
    const groupUserRef = doc(db, `groups/${groupId}/users/${userId}`);
    const userGroupRef = doc(db, `users/${userId}/groups/${groupId}`);
    const userTeamGroupRef = doc(
      db,
      `users/${userId}/teams/${teamId}/groups/${groupId}`
    );
  
    const userDoc = await getDoc(userRef);
    const teamDoc = await getDoc(teamRef);
    const groupDoc = await getDoc(groupRef);
    const teamUserDoc = await getDoc(teamUserRef);
  
    const teamSnapshot = teamDoc.data();
    const teamCreatorId = teamSnapshot.creatorId;
  
    const groupSnapshot = groupDoc.data();
    const groupCreatorId = groupSnapshot.creatorId;
  
    const userIsTeamMember = teamUserDoc.exists();
  
    if (
      userDoc.exists() &&
      teamDoc.exists() &&
      groupDoc.exists() &&
      (teamCreatorId === authId || groupCreatorId === authId)
    ) {
      if (userIsTeamMember) {
        batch.set(userGroupRef);
        batch.set(userTeamGroupRef);
        batch.set(groupUserRef);
      } else {
        return alert("User does not belong to this team");
      }
    } else {
      return alert("Team, Group, or User does not exist");
    }
  };
  export const removeGroupMember = async (userId, teamId, groupId) => {
    const batch = writeBatch(db);
    const authId = auth.currentUser.uid;
  
    const userRef = doc(db, `users/${userId}`);
    const teamRef = doc(db, `teams/${teamId}`);
    const groupRef = doc(db, `groups/${groupId}`);
    const teamUserRef = doc(db, `teams/${teamId}/users/${userId}`);
    const groupUserRef = doc(db, `groups/${groupId}/users/${userId}`);
    const userGroupRef = doc(db, `users/${userId}/groups/${groupId}`);
    const userTeamGroupRef = doc(
      db,
      `users/${userId}/teams/${teamId}/groups/${groupId}`
    );
  
    const userDoc = await getDoc(userRef);
    const teamDoc = await getDoc(teamRef);
    const groupDoc = await getDoc(groupRef);
    const teamUserDoc = await getDoc(teamUserRef);
  
    const teamSnapshot = teamDoc.data();
    const teamCreatorId = teamSnapshot.creatorId;
  
    const groupSnapshot = groupDoc.data();
    const groupCreatorId = groupSnapshot.creatorId;
  
    const userIsTeamMember = teamUserDoc.exists();
  
    if (
      userDoc.exists() &&
      teamDoc.exists() &&
      groupDoc.exists() &&
      (teamCreatorId === authId || groupCreatorId === authId)
    ) {
      if (userIsTeamMember) {
        batch.delete(userGroupRef);
        batch.delete(userTeamGroupRef);
        batch.delete(groupUserRef);
      } else {
        return alert("User does not belong to this team");
      }
    } else {
      return alert("Team, Group, or User does not exist");
    }
  };
