import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { db, auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// import { clockIn, clockOut, getUserById } from '../../utils/api/users';
import { useRouter } from "next/router";
import {
  getAuthsTeams,
  getGroupById,
  getTeamById,
  getUserGroups,
} from "../utils/api/teams";
import { getTeamMembers } from "../utils/api/teams";
import { useAuth } from "./auth/AuthContext";
import {
  fetchGroupMessages,
  fetchTeamMessages,
  createGroupMessage,
  createTeamMessage,
  editMessage,
  createTeamReply,
  createGroupReply,
  deleteMessage,
  fetchDirectChat,
  createDirectMessage,
} from "../utils/api/messages";
import moment from "moment";
const TeamsContext = createContext();

export function useTeams() {
  return useContext(TeamsContext);
}

export function TeamsProvider({ children }) {
  const { authUser } = useAuth();

  const [team, setTeam] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamChat, setTeamChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupChat, setGroupChat] = useState([]);

  const [directMessages, setDirectMessages] = useState([]);
  const [directMessagesLoading, setDirectMessagesLoading] = useState(true);

  const [builder, setBuilder] = useState([]);
  const [teamsHistory, setTeamsHistory] = useState([]);
  const [groupsHistory, setGroupsHistory] = useState([]);
  const [directMessagesHistory, setDirectMessagesHistory] = useState([]);
  const [chatId, setChatId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const chatEndRef = useRef(null);
  const chatStartRef = useRef(null);

  const getTeams = async () => {
    const teams = await getAuthsTeams();
    if (teams === false) {
      setTeams([]);
      setTeamsLoading(false);
      return;
    }

    setTeams(teams);
    setTeamsLoading(false);

    return teams;
  };

  const teamFoundInHistory = () => {
    return teamsHistory.find((team) => team?.id === router.query.teamId);
  };
  const groupFoundInHistory = () => {
    return groupsHistory.find((group) => group?.id === router.query.groupId);
  };

  const directMessageUserFoundInHistory = () => {
    return directMessagesHistory.find(
      (user) => user.username === router.query.username
    );
  };

  const getDirectChat = async () => {
    const { username, teamId } = router.query;
    const userFound = directMessageUserFoundInHistory();
    if (userFound) {
      setDirectMessages(userFound.messages);
    } else {
      setChatLoading(true);
      
      const chat = await fetchDirectChat(username, query);

      const updatedMessages = chat.messages.map((message) => {
        if (message.replyTo) {
          const match = chat.messages.find((m) => m.id === message.replyTo.id);
          if (match.text !== message.replyToText) {
            message.replyTo.isEdited = true;
          } else {
            message.replyTo.isEdited = false;
          }
        }

        return message;
      });

      setDirectMessages(updatedMessages);
      // setTeamMembers(members);
      setChatLoading(false);
      setChatId(chat.id);
      setDirectMessagesHistory([
        ...directMessagesHistory,
        { ...chat, messages: updatedMessages },
      ]);

      return updatedMessages;
    }
  };

  const getTeam = async () => {
    const teamFound = teamFoundInHistory();
    if (teamFound) {
      setError(null);
      setTeamChat(teamFound.chat.messages);
      getGroups(teamFound.id);
      // setTeamMembers(teamFound.members);
      setTeam(teamFound);
      setTeamLoading(false);
    } else {
      setChatLoading(true);
      setTeamLoading(true);
      const team = await getTeamById(router.query.teamId);

      if (!team) {
        setError("Team Not Found");
        return;
      }

      if (team === false) {
        setError(404);
        return;
      }

      console.log("Team: ", team);

      setError(null);
      // const messages = await getTeamMessages();
      getGroups(team.id);
      // setTeamMembers(team.members);
      setTeam(team);
      setTeamChat(team.chat.messages);
      setTeamLoading(false);
      setChatLoading(false);
      setBuilder([...builder, team]);
      setTeamsHistory([...teamsHistory, team]);
    }
  };

  const getGroup = async () => {
    const groupFound = groupFoundInHistory();
    if (groupFound) {
      setGroupChat(groupFound.chat.messages);
      setGroup(group);
      // setGroupMembers(groupFound.members);
      setGroupLoading(false);
    } else {
      setGroupLoading(true);
      setChatLoading(true);
      const group = await getGroupById(router.query.groupId);
      if (!group) {
        setError("Group Not Found");
        return;
      }

      setGroup(group);
      setGroupChat(group.chat.messages);
      setGroupLoading(false);
      setChatLoading(false);

      setGroupsHistory([...groupsHistory, group]);
    }
  };

  const addTeamMessage = async (type, text) => {
    console.log(team.chat.id);
    const message = await createTeamMessage(
      authUser,
      router.query.teamId,
      text,
      type,
      team.chat.id
    );

    const updateHistory = teamsHistory.map((team) => {
      if (team.id === router.query.teamId) {
        team.chat.messages = [...team.chat.messages, message];
      }

      return team;
    });

    setTeamChat([...teamChat, message]);
    setTeamsHistory(updateHistory);
  };
  const addDirectMessage = async (type, text) => {
    const message = await createDirectMessage(
      authUser,
      router.query.teamId,
      text,
      type
    );
    setDirectMessages([...directMessages, message]);

    const updateHistory = directMessagesHistory.map((user) => {
      if (user.username === router.query.username) {
        user.messages = [...user.messages, message];
      }

      return user;
    });

    setDirectMessagesHistory(updateHistory);
  };

  const deleteTeamMessage = async (messageId) => {
    await deleteMessage(messageId);
    setTeamChat(teamChat.filter((message) => message.id !== messageId));

    const updateHistory = teamsHistory.map((team) => {
      if (team.id === router.query.teamId) {
        team.chat.messages = team.chat.messages.filter(
          (item) => item.id !== messageId
        );
      }

      return team;
    });

    setTeamsHistory(updateHistory);
  };
  const deleteDirectMessage = async (messageId) => {
    await deleteMessage(messageId);
    setDirectMessages(
      directMessages.filter((message) => message.id !== messageId)
    );

    const updateHistory = directMessagesHistory.map((user) => {
      if (user.username === router.query.username) {
        user.messages = user.messages.filter((item) => item.id !== messageId);
      }

      return team;
    });

    setTeamsHistory(updateHistory);
  };

  const addTeamReply = async (replyTo, text) => {
    const message = await createTeamReply(
      authUser,
      router.query.teamId,
      text,
      "reply",
      replyTo,
      team.chat.id
    );

    const updateHistory = teamsHistory.map((team) => {
      if (team.id === router.query.teamId) {
        team.chat.messages = [...team.chat.messages, message];
      }

      return team;
    });

    setTeamChat([...teamChat, message]);
    setTeamsHistory(updateHistory);
  };
  const addDirectMessageReply = async (replyTo, text) => {
    const message = await createTeamReply(
      authUser,
      router.query.teamId,
      text,
      "reply",
      replyTo
    );

    const updateHistory = directMessagesHistory.map((user) => {
      if (user.username === router.query.username) {
        user.messages = [...user.messages, message];
      }

      return user;
    });

    setDirectMessages([...directMessages, message]);
    setDirectMessagesHistory(updateHistory);
  };

  const addGroupMessage = async (type, text) => {
    const message = await createGroupMessage(
      authUser,
      router.query.groupId,
      text,
      type,
      group.chat.id
    );

    const updateHistory = groupsHistory.map((group) => {
      if (group.id === router.query.groupId) {
        group.chat.messages = [...group.chat.messages, message];
      }

      return group;
    });

    setGroupChat([...groupChat, message]);
    setGroupsHistory(updateHistory);
  };

  const deleteGroupMessage = async (messageId) => {
    await deleteMessage(messageId);

    const updateHistory = groupsHistory.map((group) => {
      if (group.id === router.query.groupId) {
        group.chat.messages = group.chat.messages.filter(
          (message) => message.id !== messageId
        );
      }

      return group;
    });

    setGroupChat(groupChat.filter((message) => message.id !== messageId));
    setGroupsHistory(updateHistory);
  };

  const addGroupReply = async (replyTo, text) => {
    const message = await createGroupReply(
      authUser,
      router.query.groupId,
      text,
      "reply",
      replyTo,
      group.chat.id
    );

    const updateHistory = groupsHistory.map((group) => {
      if (group.id === router.query.groupId) {
        group.chat.messages = [...group.chat.messages, message];
      }

      return group;
    });

    setGroupChat([...groupChat, message]);
    setGroupsHistory(updateHistory);
  };

  const editTeamMessage = async (message, text) => {
    await editMessage(message.id, text);
    const updatedMessages = teamChat.map((item) => {
      if (item.id === message.id) {
        item.text = text;
        item.edited = true;
      }

      if (item.replyTo?.id === message.id) {
        item.replyTo.text = message.text;

        item.replyTo.isEdited = true;
      }

      return item;
    });

    setTeamChat(updatedMessages);
  };
  const editDirectMessage = async (message, text) => {
    await editMessage(message.id, text);
    const updatedMessages = directMessages.map((item) => {
      if (item.id === message.id) {
        item.text = text;
        item.edited = true;
      }

      if (item.replyTo?.id === message.id) {
        item.replyTo.text = message.text;

        item.replyTo.isEdited = true;
      }

      return item;
    });

    setDirectMessages(updatedMessages);
  };

  const editGroupMessage = async (message, text) => {
    await editMessage(message.id, text);
    const updatedMessages = groupChat.map((item) => {
      if (item.id === message.id) {
        item.text = text;
        item.edited = true;
      }

      if (item.replyTo?.id === message.id) {
        item.replyTo.text = message.text;

        item.replyTo.isEdited = true;
      }

      return item;
    });

    setGroupChat(updatedMessages);
  };

  const getTeamMessages = async () => {
    setChatLoading(true);
    const messages = await fetchTeamMessages(router.query.teamId);
    const updatedMessages = messages.map((message) => {
      if (message.replyTo) {
        const match = messages.find((m) => m.id === message.replyTo.id);
        if (match.text !== message.replyToText) {
          message.replyTo.isEdited = true;
        } else {
          message.replyTo.isEdited = false;
        }
      }

      return message;
    });

    setTeamChat(updatedMessages);
    setChatLoading(false);

    return updatedMessages;
  };

  const getGroupMessages = async () => {
    setChatLoading(true);
    const messages = await fetchGroupMessages(router.query.groupId);
    const updatedMessages = messages.map((message) => {
      if (message.replyTo) {
        const match = messages.find((m) => m.id === message.replyTo.id);
        if (match.text !== message.replyToText) {
          message.replyTo.isEdited = true;
        } else {
          message.replyTo.isEdited = false;
        }
      }

      return message;
    });

    setGroupChat(updatedMessages);
    setChatLoading(false);

    return messages;
  };

  const getGroups = async (teamId) => {
    const groups = await getUserGroups(teamId);
    setGroups(groups);
    setGroupsLoading(false);
  };

  const joinGroup = async () => {};
  const addUserToGroup = async () => {};

  const removeUserFromTeam = () => {};
  const removeUserFromGroup = () => {};

  const deleteTeam = async (authId, teamId) => {};
  const deleteGroup = async (authId, teamId) => {};

  const convertMessages = (messages) => {
    const extractedDates = messages?.map((message) => {
      const seconds = message?.createdAt?.seconds;
      const postedDate = moment.unix(seconds).format("M D YY");
      message = postedDate;
      return message;
    });

    const dates = extractedDates.filter((message, index) => {
      return extractedDates.indexOf(message) === index;
    });

    const messagesByDate = dates.map((date) => {
      const filter = messages.filter((message) => {
        const seconds = message?.createdAt?.seconds;
        const postedDate = moment.unix(seconds).format("M D YY");
        if (date === postedDate) {
          return message;
        }
      });
      return [date, filter];
    });

    return messagesByDate;
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView();
  };
  const scrollToTop = () => {
    chatStartRef.current?.scrollIntoView();
  };

  const value = {
    loading,
    teamsLoading,
    teamLoading,
    groupsLoading,
    groupLoading,
    teams,
    team,
    teamChat,
    teamMembers,
    groupMembers,
    groups,
    group,
    groupChat,
    error,
    chatEndRef,
    chatStartRef,
    chatLoading,
    builder,
    directMessages,
    directMessagesHistory,
    setError,
    setTeam,
    setTeams,
    getTeams,
    getTeam,
    getGroups,
    getGroup,
    getDirectChat,
    setGroups,
    getGroupMessages,
    getTeamMessages,
    addGroupMessage,
    addDirectMessage,
    addTeamMessage,
    addTeamReply,
    addGroupReply,
    addDirectMessageReply,
    editTeamMessage,
    editGroupMessage,
    editDirectMessage,
    deleteTeamMessage,
    deleteGroupMessage,
    deleteDirectMessage,
    convertMessages,
    scrollToBottom,
    scrollToTop,
  };

  return (
    <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
  );
}
