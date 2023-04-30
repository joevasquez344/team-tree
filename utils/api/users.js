import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  setDoc,
  writeBatch,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import moment from "moment";

const getAppUsers = async () => {
  const ref = collection(db, "users");
  const snapshot = await getDocs(ref);
  const users = snapshot.docs.map((user) => ({ id: user.id, ...user.data() }));

  return users;
};

const getUserById = async (userId) => {
  const ref = doc(db, `users/${userId}`);
  const snapshot = await getDoc(ref);
  const user = { id: snapshot.id, ...snapshot.data() };
  console.log('hello')

  return user;
};
const getUserByEmail = async (email) => {
  const ref = collection(db, "users");
  const filter = query(ref, where("email", "==", email));
  const snapshot = await getDocs(filter);

  if (snapshot.empty) {
    return {
      error: true,
      errorCode: 1001,
      payload: "User does not exist",
    };
  }

  const user = { id: snapshot.docs[0], ...snapshot.docs[0].data() };
  return {
    error: false,
    payload: user,
  };
};
const getTeamMembers = async () => {
  const teamsRef = collection(db, `users/${auth?.currentUser?.uid}/teams`);
  const teamsSnapshot = await getDocs(teamsRef);
  const teamIds = teamsSnapshot.docs.map((d) => d.id);
  const usersRef = collection(db, `users`);
  const usersSnapshot = await getDocs(usersRef);

  const users = usersSnapshot.docs.map((user) => ({
    id: user.id,
    username: user.data().username,
  }));

  let teams = await Promise.all(
    teamIds.map(
      async (id) => await getDocs(collection(db, `teams/${id}/users`))
    )
  );

  // let users = teams.map((team) =>
  //   team.docs.map((d) => ({ id: d.id, ...d.data() }))
  // );

  // users = [].concat.apply([], users);
  console.log(users);
  return users;

  // teams.map(async team => await getDocs(collection(db, `/teams/${team.id}/users`)))
};
const getUserByUsername = async (username) => {
  const ref = collection(db, "users");
  const filter = query(ref, where("username", "==", username));
  const snapshot = await getDocs(filter);

  const user = {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
    createdAt: snapshot.docs[0].data().createdAt.toString(),
  };

  return user;
};

const getUsersByPosition = async (position) => {
  const ref = collection(db, "users");
  const filter = query(ref, where("position", "==", position));
  const snapshot = await getDocs(filter);
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return users;
};

const createUser = async (user) => {
  await setDoc(doc(db, "users", user.id), {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: null,
    username: user.username,
    position: user.position,
    clockedIn: false,
    onlineStatus: "offline",
    onlineHistory: [],
    createdAt: serverTimestamp(),
  });
};

const clockIn = async (authId) => {
  const batch = writeBatch(db);
  const userRef = doc(db, `users/${authId}`);
  const snapshot = await getDoc(doc(db, `users/${authId}`));
  const data = snapshot.data();
  console.log("Data: ", data);

  const onlineHistory = data?.onlineHistory;

  let time = moment().format("MMMM Do YYYY, h:mm:ss a").split(",")[1];
  const timeOfDay = time.split(" ")[2];
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];

  time = `${hour}:${minute} ${timeOfDay}`;

  console.log("Time: ", time);

  batch.update(userRef, {
    onlineStatus: "online",
    onlineHistory: [...onlineHistory, time],
  });

  await batch.commit();

  return time;
};

const clockOut = async (authId) => {
  const batch = writeBatch(db);
  const userRef = doc(db, `users/${authId}`);
  const snapshot = await getDoc(doc(db, `users/${authId}`));
  const data = snapshot.data();
  console.log("Data: ", data);
  const onlineHistory = data?.onlineHistory;

  let time = moment().format("MMMM Do YYYY, h:mm:ss a").split(",")[1];
  const timeOfDay = time.split(" ")[2];
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];

  time = `${hour}:${minute} ${timeOfDay}`;

  batch.update(userRef, {
    onlineStatus: "offline",
    onlineHistory: [...onlineHistory, time],
  });

  await batch.commit();

  return time;
};

export {
  getAppUsers,
  getUserById,
  getUserByUsername,
  getUsersByPosition,
  getTeamMembers,
  getUserByEmail,
  createUser,
  clockIn,
  clockOut,
};
