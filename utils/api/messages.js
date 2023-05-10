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

const createTeamMessage = async (authUser, teamId, text, type, chatId) => {
  const messagesRef = collection(db, "messages");
  const chatRef = doc(db, `chats/${chatId}`);
  const userRef = doc(db, `users/${authUser.id}`);
  const teamRef = doc(db, `teams/${teamId}`);

  const { id } = await addDoc(messagesRef, {
    userRef,
    teamRef,
    chatRef,
    text,
    type,
    replyToMessage: null,
    replyToRef: null,
    replyToText: null,
    createdAt: serverTimestamp(),
    edited: false,
  });

  const createdAt = await getMessageTimestamp(id);

  return {
    id,
    user: authUser,
    userRef,
    teamRef,
    chatRef,
    replyToMessage: null,
    replyToRef: null,
    replyToText: null,
    text,
    type,
    replies: [],
    createdAt,
  };
};

const createTeamReply = async (
  authUser,
  teamId,
  text,
  type,
  replyTo,
  chatId
) => {
  const batch = writeBatch(db);
  const messagesRef = collection(db, "messages");
  const chatRef = doc(db, `chats/${chatId}`);
  const userRef = doc(db, `users/${authUser.id}`);
  const teamRef = doc(db, `teams/${teamId}`);
  const { id } = await addDoc(messagesRef, {
    userRef,
    teamRef,
    chatRef,
    text,
    type,
    replyToRef: doc(db, `messages/${replyTo.id}`),
    replyToMessage: replyTo,
    replyToText: replyTo.text,
    createdAt: serverTimestamp(),
    edited: false,
  });

  const replyToRef = doc(db, `messages/${replyTo.id}/replies/${id}`);
  batch.set(replyToRef, {});

  await batch.commit();

  const createdAt = await getMessageTimestamp(id);

  return {
    id,
    user: authUser,
    userRef,
    teamRef,
    chatRef,
    text,
    type,
    replyToMessage: replyTo,
    replyToText: replyTo.text,
    replyToRef,
    edited: false,
    createdAt,
  };
};

const createGroupMessage = async (authUser, groupId, text, type, chatId) => {
  const messagesRef = collection(db, "messages");
  const userRef = doc(db, `users/${authUser.id}`);
  const groupRef = doc(db, `groups/${groupId}`);
  const chatRef = doc(db, `chats/${chatId}`);

  const { id } = await addDoc(messagesRef, {
    userRef,
    groupRef,
    chatRef,
    text,
    type,
    replyToRef: null,
    replyToMessage: null,
    replyToText: null,
    createdAt: serverTimestamp(),
    edited: false,
  });

  const createdAt = await getMessageTimestamp(id);

  return {
    id,
    user: authUser,
    userRef,
    groupRef,
    chatRef,
    replyToRef: null,
    replyToMessage: null,
    replyToText: null,
    text,
    type,
    replies: [],
    createdAt,
    edited: false,
  };
};

const createGroupReply = async (
  authUser,
  groupId,
  text,
  type,
  replyTo,
  chatId
) => {
  const batch = writeBatch(db);
  const messagesRef = collection(db, "messages");
  const userRef = doc(db, `users/${authUser.id}`);
  const chatRef = doc(db, `chats/${chatId}`);
  const groupRef = doc(db, `groups/${groupId}`);

  const { id } = await addDoc(messagesRef, {
    userRef,
    groupRef,
    chatRef,
    text,
    type,
    replyToRef: doc(db, `messages/${replyTo.id}`),
    replyToMessage: replyTo,
    replyToText: replyTo.text,
    createdAt: serverTimestamp(),
    edited: false,
  });

  const replyToRef = doc(db, `messages/${replyTo.id}/replies/${id}`);
  batch.set(replyToRef, {});

  await batch.commit();

  const createdAt = await getMessageTimestamp(id);

  return {
    id,
    user: authUser,
    userRef,
    groupRef,
    chatRef,
    text,
    type,
    replyToRef,
    replyToMessage: replyTo,
    replyToText: replyTo.text,
    edited: false,
    createdAt,
  };
};

const createDirectMessage = async (authUser, teamId, text, type, chatId) => {
  const messagesRef = collection(db, "messages");
  const userRef = doc(db, `users/${authUser.id}`);
  const teamRef = doc(db, `teams/${teamId}`);
  const chatRef = doc(db, `chats/${chatId}`);

  const { id } = await addDoc(messagesRef, {
    userRef,
    teamRef,
    chatRef,
    text,
    type,
    replyToRef: null,
    replyToMessage: null,
    replyToText: null,
    createdAt: serverTimestamp(),
    edited: false,
  });

  const createdAt = await getMessageTimestamp(id);

  return {
    id,
    user: authUser,
    userRef,
    teamRef,
    chatRef,
    text,
    type,
    replyToRef: null,
    replyToMessage: null,
    replyToText: null,
    replies: [],
    createdAt,
    edited: false,
  };
};

const getMessageById = async (id) => {
  const ref = doc(db, `messages/${id}`);
  const snapshot = await getDoc(ref);
  const message = {
    id: snapshot.id,
    ...snapshot.data(),
    user: await getDoc(doc(db, `users/${snapshot.data().userRef.id}`)),
    replyTo: await getReply(snapshot),
  };

  return message;
};

const deleteMessage = async (messageId) => {
  const messageRef = doc(db, `messages/${messageId}`);
  await deleteDoc(messageRef);
};

const getMessageTimestamp = async (id) => {
  const ref = doc(db, `messages/${id}`);
  const snapshot = await getDoc(ref);
  const data = snapshot.data();
  const createdAt = data.createdAt;
  return createdAt;
};

const getReply = async (document) => {
  const data = document.data();
  const replyToRef = data.replyToRef;

  if (replyToRef === null) {
    return null;
  }

  let message = await getDoc(doc(db, replyToRef.path));
  

  if (message?.exists()) {
    message = {
      id: message.id,
      ...message.data(),
      user: await getDoc(doc(db, `users/${message.data().userRef.id}`)),
    };

    message = {
      ...message,
      user: { id: message.user.id, ...message.user.data() },
    };
    return message;
  } else {
    return null
  }
};

const editMessage = async (messageId, text) => {
  const messageRef = doc(db, `messages/${messageId}`);
  await updateDoc(messageRef, { text, edited: true });
};

// const fetchGroupMessages = async (groupId) => {
//   const messagesRef = collection(db, "messages");
//   const groupRef = doc(db, `groups/${groupId}`);
//   const messagesQuery = query(
//     messagesRef,
//     where("groupRef", "==", groupRef),
//     orderBy("createdAt", "asc")
//   );
//   const messagesSnapshot = await getDocs(messagesQuery);
//   let messages = await Promise.all(
//     messagesSnapshot.docs.map(async (d) => ({
//       id: d.id,
//       ...d.data(),
//       user: await getDoc(doc(db, `users/${d.data().userRef.id}`)),
//       replyTo: await getReply(d),
//     }))
//   );

//   messages = messages.map((message) => ({
//     ...message,
//     user: { id: message.user.id, ...message.user.data() },
//   }));

//   return messages;
// };

export {
  createTeamMessage,
  createTeamReply,
  createGroupMessage,
  createGroupReply,
  createDirectMessage,
  getMessageById,
  editMessage,
  deleteMessage,
  getReply,
};
