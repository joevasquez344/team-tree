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
} from "firebase/firestore";
import { db } from "../../firebase/config";

const getTaskDetails = async (taskId, userId) => {
  const taskRef = doc(db, `tasks/${taskId}`);
  const taskSnapshot = await getDoc(taskRef);
  return { id: taskSnapshot.id, ...taskSnapshot.data() };
};
const getUsersTask = async (userId) => {
  try {
    const ref = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(ref);

    let tasks = await Promise.all(
      snapshot.docs.map(async (task) => await getDoc(doc(db, `tasks/${task.id}`)))
    );

    tasks = tasks.map((task) => ({ id: task.id, ...task.data() }));
    // const tasksRef = collection(db, "tasks");
    // const tasksQuery = query(tasksRef, where("user" == userRef));
    // const tasksSnapshot = await getDocs(tasksQuery);
    // let tasks = tasksSnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    console.log("Tasks: ", tasks);

    return tasks
  } catch (error) {
    console.log("Error: ", error);
  }
};
const getUserTaskByDate = async (taskId, userId) => {};

const getUsersTasks = async (userId) => {
  // const tasksRef = collection(db, "tasks");
  const taskIds = collection(db, `users/${userId}/tasks`);
  // const taskIds = await getDocs(tasksRef);
  const tasks = await Promise.all(
    taskIds.map(async (d) => await getDoc(doc(db, `tasks/${d.id}`)))
  );

  return tasks.map((task) => ({ id: task.id, ...task.data() }));
};

const fetchTasksByGroup = async (groupId) => {
  const taskIds = collection(db, `groups/${groupId}/tasks`);
  const tasks = await Promise.all(
    taskIds.map(async (d) => await getDoc(doc(db, `tasks/${d.id}`)))
  );
  return tasks.map((task) => ({ id: task.id, ...task.data() }));
};

const createTask = async (authUser, team, group, input) => {
  const batch = writeBatch(db);

  const userRef = doc(db, `users/${authUser.id}`);
  const teamRef = doc(db, `teams/${team.id}`);
  const task = await addDoc(collection(db, "tasks"), {
    user: userRef,
    team: teamRef,
    tasks: input,
    createdAt: serverTimestamp(),
  });

  //   await setDoc(doc(db, `users/${authUser.id}/tasks/${task.id}` ))

  console.log("Task: ", task.id);

  batch.set(doc(db, `users/${authUser.id}/tasks/${task.id}`), {});
  batch.set(doc(db, `teams/${team.id}/tasks/${task.id}`), {});

  if (group) {
    // Attach task to group
    batch.set(doc(db, `groups/${group.id}/tasks/${task.id}`), {});

    // await batch.commit();
  }

  await batch.commit();
};

const deleteTask = async (authUser, team, group, task) => {
  const batch = writeBatch(db);

  batch.delete(doc(db, `tasks/${task.id}`));
  batch.delete(doc(db, `users/${authUser.id}/tasks/${task.id}`));
  batch.delete(doc(db, `teams/${team.id}/tasks/${task.id}`));

  if (group) {
    // Attach task to group
    batch.delete(doc(db, `groups/${team.id}/tasks/${task.id}`));
  }

  await batch.commit();
};

const editTask = async (authUser, team, group, task, input) => {
  const batch = writeBatch(db);

  batch.update(doc(db, `tasks/${task.id}`), {
    tasks: input,
    createdAt: serverTimestamp(),
  });

  await batch.commit();
};

export {
  createTask,
  deleteTask,
  editTask,
  getUsersTasks,
  fetchTasksByGroup,
  getTaskDetails,
  getUsersTask,
};
