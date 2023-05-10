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
import { isTeamMember } from "./helpers";
import { getReply } from "./messages";

const fetchDirectChat = async (username, teamId, authId) => {
  const usersRef = collection(db, "users");
  const teamRef = doc(db, `teams/${teamId}`);

  const isMember = await isTeamMember(teamId, authId);

  if (!isMember) return;

  const usersQuery = query(usersRef, where("username", "==", username));

  const usersSnapshot = await getDocs(usersQuery);

  const user = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0];

  if (user) {
    const userRef = doc(db, `users/${user.id}`);
    const authRef = doc(db, `users/${authId}`);

    const chatsRef = collection(db, "chats");
    const chatsQuery = query(
      chatsRef,
      where("creatorRef", "==", authRef),
      where("userRef", "==", userRef),
      where("teamRef", "==", teamRef)
    );
    const chatsSnapshot = await getDocs(chatsQuery);
    if (chatsSnapshot.empty) {
      await createDirectChat(user.id, authId);
      const chat = await getChat("dm", user.id, teamId);

      return chat;
    } else {
      const chat = await getChat("dm", user.id, teamId);

      return chat;
    }
  }
};

const fetchTeamChat = async (teamId) => {
  const teamRef = doc(db, `teams/${teamId}`);
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(chatsRef, where("teamRef", "==", teamRef));
  const chatsSnapshot = await getDocs(chatsQuery);
  console.log("Team Id: ", teamId);
  const chat = chatsSnapshot.docs.map((chat) => ({
    id: chat.id,
    ...chat.data(),
  }))[0];

  const messages = await getChatMessages(chat?.id);
  return { ...chat, messages };
};

const fetchGroupChat = async (groupId) => {
  const groupRef = doc(db, `groups/${groupId}`);
  const chatsRef = collection(db, "chats");
  const chatsQuery = query(chatsRef, where("groupRef", "==", groupRef));
  const chatsSnapshot = await getDocs(chatsQuery);

  const chat = chatsSnapshot.docs.map((chat) => ({
    id: chat.id,
    ...chat.data(),
  }))[0];

  const messages = await getChatMessages(chat?.id);
  return { ...chat, messages };
};

const getChatMessages = async (chatId) => {
  const messagesRef = collection(db, "messages");
  const chatRef = doc(db, `chats/${chatId}`);
  const messagesQuery = query(
    messagesRef,
    where("chatRef", "==", chatRef),
    orderBy("createdAt", "asc")
  );

  const messagesSnapshot = await getDocs(messagesQuery);

  if (messagesSnapshot.empty) return [];
  let messages = await Promise.all(
    messagesSnapshot.docs.map(async (d) => {
      return {
        id: d.id,
        ...d.data(),
        user: await getDoc(doc(db, `users/${d.data().userRef.id}`)),
        replyToMessage: await getReply(d),
      };
    })
  );




  messages = messages.map((message) => ({
    ...message,
    user: { id: message.user.id, ...message.user.data() },
  }));

  messages = messages.map((message) => {
    if (message.replyToMessage?.id) {
      const match = messages.find((m) => m.id === message.replyToMessage.id);
      if (match) {
        if (match.text !== message.replyToText) {
          message.replyToMessage.isEdited = true;
        } else {
          message.replyToMessage.isEdited = false;
        }
      } 
    }

    return message;
  });


  return messages;
};

const createTeamChat = async (teamId, authId) => {
  const chatsRef = collection(db, "chats");
  const authRef = doc(db, `users/${authId}`);
  const teamRef = doc(db, `teams/${teamId}`);

  await addDoc(chatsRef, {
    teamRef,
    creatorRef: authRef,
    creatorId: authRef.id,
  });
};

const createGroupChat = async (groupId, authId) => {
  const groupRef = doc(db, `groups/${groupId}`);
  const chatsRef = collection(db, "chats");
  const authRef = doc(db, `users/${authId}`);

  await addDoc(chatsRef, {
    groupRef,
    creatorRef: authRef,
    creatorId: authRef.id,
  });
};

const createDirectChat = async (userId, authId) => {
  const authRef = doc(db, `users/${authId}`);
  const userRef = doc(db, `users/${userId}`);
  const chatsRef = collection(db, "chats");

  await addDoc(chatsRef, {
    userRef,
    creatorRef: authRef,
    creatorId: authRef.id,
    teamRef,
  });
};

const createChat = async (type, id, teamId, authId) => {
  const chatRef = collection(db, "chats");
  const authRef = doc(db, `users/${authId}`);

  if (type === "team") {
    const teamRef = doc(db, `teams/${id}`);
  }
  if (type === "group") {
    const groupRef = doc(db, `groups/${id}`);
    await addDoc(chatRef, {
      groupRef,
      creatorRef: authRef,
      creatorId: authRef.id,
    });
  }
  if (type === "dm") {
    const userRef = doc(db, `users/${id}`);
    if (teamId) {
      const teamRef = doc(db, `teams/${teamId}`);
      const { id } = await addDoc(chatRef, {
        userRef,
        creatorRef: authRef,
        creatorId: authRef.id,
        teamRef,
      });
    }

    return id;
  }
};
export {
  getChatMessages,
  createChat,
  createDirectChat,
  createGroupChat,
  createTeamChat,
  fetchDirectChat,
  fetchTeamChat,
  fetchGroupChat,
};
