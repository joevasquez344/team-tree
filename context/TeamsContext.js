import React, {
    useContext,
    createContext,
    useState,
    useEffect,
    useRef,
   } from "react";
   // import { clockIn, clockOut, getUserById } from '../../utils/api/users';
   import { useRouter } from "next/router";
   import { getAuthsTeams, getTeamById } from "../utils/api/teams";
   import { getGroupById, getUserGroups } from "../utils/api/group";
   import { useAuth } from "./auth/AuthContext";
   import {
    fetchDirectChat,
    fetchGroupChat,
    fetchTeamChat,
   } from "../utils/api/chat";
   import {
    createGroupMessage,
    createTeamMessage,
    editMessage,
    createTeamReply,
    createGroupReply,
    deleteMessage,
    createDirectMessage,
   } from "../utils/api/messages";
   import moment from "moment";
   
   
   export const TeamsContext = createContext();
   
   
   export function useTeams() {
    return useContext(TeamsContext);
   }
   
   
   export function  TeamsProvider({ children }) {
    const { authUser } = useAuth();
   
   
    const [team, setTeam] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamLoading, setTeamLoading] = useState(true);
    const [teamChat, setTeamChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(true);
   
   
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [groupLoading, setGroupLoading] = useState(true);
    const [groupChat, setGroupChat] = useState(null);
   
   
    const [directChat, setDirectChat] = useState(null);
    const [directMessagesLoading, setDirectChatLoading] = useState(true);
   
   
    const [builder, setBuilder] = useState([]);
    const [teamsHistory, setTeamsHistory] = useState([]);
    const [groupsHistory, setGroupsHistory] = useState([]);
    const [directMessagesHistory, setDirectChatHistory] = useState([]);
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
   
   
    const getTeamChat = async () => {
      const teamId = router.query.teamId;
   
   
      const team = teamFoundInHistory();
      if (team) {
        setTeamChat(team.chat);
      } else {
        const chat = await fetchTeamChat(teamId);
   
   
        const updateHistory = teamsHistory.map((team) => {
          if (team.id === teamId) {
            team.chat = chat;
          }
   
   
          return team;
        });
        setTeamChat(chat);
        setTeamsHistory(updateHistory);
        setChatLoading(false);
      }
    };
   
   
    const getGroupChat = async () => {
      const groupId = router.query.groupId;
   
   
      const group = groupFoundInHistory();
      if (group) {
        setGroupChat(group.chat);
      } else {
        const chat = await fetchGroupChat(groupId);
   
   
        const updateHistory = groupsHistory.map((group) => {
          if (group.id === groupId) {
            group.chat = chat;
          }
   
   
          return group;
        });
   
   
        setGroupChat(chat);
        setGroupsHistory(updateHistory);
        setChatLoading(false);
      }
    };
   
   
    const getDirectChat = async () => {
      const { username, teamId } = router.query;
      const userFound = directMessageUserFoundInHistory();
      if (userFound) {
        setDirectChat(userFound);
      } else {
        const chat = await fetchDirectChat(username, teamId);
   
   
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
   
   
        setDirectChat(updatedMessages);
        // setTeamMembers(members);
        setChatLoading(false);
        setChatId(chat.id);
        setDirectChatHistory([
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
   
   
        getGroups(teamFound.id);
        // setTeamMembers(teamFound.members);
        setTeam(teamFound);
        setTeamChat(teamFound.chat);
        setTeamLoading(false);
      } else {
        setTeamLoading(true);
        const team = await getTeamById(router.query.teamId);
        getTeamChat();
        getGroups(team.id);
   
   
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
        const group = await getGroupById(router.query.groupId);
        getGroupChat();
   
   
        if (!group) {
          setError("Group Not Found");
          return;
        }
   
   
        setGroup(group);
        setGroupChat(group.chat);
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
      setDirectChat({
        ...directChat,
        messages: [...directChat.messages, message],
      });
   
   
      const updateHistory = directMessagesHistory.map((user) => {
        if (user.username === router.query.username) {
          user.messages = [...user.messages, message];
        }
   
   
        return user;
      });
   
   
      setDirectChatHistory(updateHistory);
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
      setDirectChat(directMessages.filter((message) => message.id !== messageId));
   
   
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
   
   
      setDirectChat({
        ...directChat,
        messages: [...directChat.messages, message],
      });
      setDirectChatHistory(updateHistory);
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
   
   
      setDirectChat(updatedMessages);
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
   
   
   