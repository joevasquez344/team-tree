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

const fetchDirectChat = async (username, teamId) => {
  const usersRef = collection(db, "users");
  const teamRef = doc(db, `teams/${teamId}`);

  const isMember = await isTeamMember(teamId, auth.currentUser.uid);

  if (!isMember) return;

  const usersQuery = query(usersRef, where("username", "==", username));

  const usersSnapshot = await getDocs(usersQuery);

  const user = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0];

  if (user) {
    const userRef = doc(db, `users/${user.id}`);
    const authRef = doc(db, `users/${auth.currentUser.uid}`);

    const chatsRef = collection(db, "chats");
    const chatsQuery = query(
      chatsRef,
      where("creatorRef", "==", authRef),
      where("userRef", "==", userRef),
      where("teamRef", "==", teamRef)
    );
    const chatsSnapshot = await getDocs(chatsQuery);
    if (chatsSnapshot.empty) {
      await createChat("dm", user.id, teamId);
      const chat = await getChat("dm", user.id, teamId);

      return chat;''
    } else {
      const chat = await getChat("dm", user.id, teamId);
      console.log("Chat: ", chat);

      return chat;
    }
  }
};

const fetchTeamChat = async (teamId) => {
    const teamRef = doc(db, `teams/${teamId}`);
    const chatsRef = collection(db, "chats");
    const chatsQuery = query(chatsRef, where("teamRef", "==", teamRef));
    const chatsSnapshot = await getDocs(chatsQuery);
  
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
  }

const getChatMessages = async (chatId) => {
  const messagesRef = collection(db, "messages");
  const chatRef = doc(db, `chats/${chatId}`);
  const messagesQuery = query(
    messagesRef,
    where("chatRef", "==", chatRef),
    orderBy("createdAt", "==", "asc")
  );

  const messagesSnapshot = await getDocs(messagesQuery);
  let messages = await Promise.all(
    messagesSnapshot.docs.map(async (d) => {
      return {
        id: d.id,
        ...d.data(),
        user: await getDoc(doc(db, `users/${d.data().userRef.id}`)),
        replyTo: await getReply(d),
      };
    })
  );

  messages = messages.map((message) => ({
    ...message,
    user: { id: message.user.id, ...message.user.data() },
  }));

  messages = messages.map((message) => {
    if (message.replyTo?.id) {
      const match = messages.find((m) => m.id === message.replyTo.id);
      if (match) {
        if (match.text !== message.replyToText) {
          message.replyTo.isEdited = true;
        } else {
          message.replyTo.isEdited = false;
        }
      } else {
        message.replyTo = null;
      }
    }

    return message;
  });

  return messages;
};

const createTeamChat = async (teamId) => {
  const chatsRef = collection(db, "chats");
  const authRef = doc(db, `users/${auth.currentUser.uid}`);
  const teamRef = doc(db, `teams/${teamId}`);

  await addDoc(chatsRef, {
    teamRef,
    creatorRef: authRef,
    creatorId: authRef.id,
  });
};

const createGroupChat = async (groupId) => {
  const groupRef = doc(db, `groups/${groupId}`);
  const chatsRef = collection(db, "chats");
  const authRef = doc(db, `users/${auth.currentUser.uid}`);

  await addDoc(chatsRef, {
    groupRef,
    creatorRef: authRef,
    creatorId: authRef.id,
  });
};

const createDirectChat = async (userId) => {
  const authRef = doc(db, `users/${auth.currentUser.uid}`);
  const userRef = doc(db, `users/${userId}`);
  const chatsRef = collection(db, "chats");

  await addDoc(chatsRef, {
    userRef,
    creatorRef: authRef,
    creatorId: authRef.id,
    teamRef,
  });
};

const createChat = async (type, id, teamId) => {
  const chatRef = collection(db, "chats");
  const authRef = doc(db, `users/${auth.currentUser.uid}`);

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
  fetchGroupChat
};



// const getChat = async (type, id, teamId) => {
//     if (type === "team") {
//       const teamRef = doc(db, `teams/${id}`);
//       const chatsRef = collection(db, "chats");
//       const chatsQuery = query(chatsRef, where("teamRef", "==", teamRef));
//       const chatsSnapshot = await getDocs(chatsQuery);

//       const chat = chatsSnapshot.docs.map((chat) => ({
//         id: chat.id,
//         ...chat.data(),
//       }))[0];

//       const messages = await getChatMessages(chat?.id);
//       return { ...chat, messages };
//     }

//     if (type === "group") {
//       const groupRef = doc(db, `groups/${id}`);
//       const chatsRef = collection(db, "chats");
//       const chatsQuery = query(chatsRef, where("groupRef", "==", groupRef));
//       const chatsSnapshot = await getDocs(chatsQuery);

//       const chat = chatsSnapshot.docs.map((chat) => ({
//         id: chat.id,
//         ...chat.data(),
//       }))[0];

//       const messages = await getChatMessages(chat?.id);
//       return { ...chat, messages };
//     }
//     if (type === "dm") {
//       const userRef = doc(db, `users/${id}`);
//       const authRef = doc(db, `users/${auth.currentUser.uid}`);
//       if (teamId) {
//         const chatsRef = collection(db, "chats");
//         const teamRef = doc(db, `teams/${teamId}`);
//         const chatsQuery = query(
//           chatsRef,
//           where("userRef", "==", userRef),
//           where("creatorRef", "==", authRef),
//           where("teamRef", "==", teamRef)
//         );
//         const chatsSnapshot = await getDocs(chatsQuery);
//         const chat = chatsSnapshot.docs.map((chat) => ({
//           id: chat.id,
//           ...chat.data(),
//         }))[0];

//         const messages = await getChatMessages(chat?.id);

//         console.log(chat);
//         return { ...chat, messages };
//       }
//     }
//   };
