import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = () => {
  const teamInvites = [
    {
      id: 1,
      to: "3w43tt33",
      from: "34355w",
      type: "invite",
      status: "pending",
      target: "team",
      teamName: "Team 1"
    },
    {
      id: 2,
      to: "3w43tt33",
      from: "34355w",
      type: "invite",
      status: "pending",
      target: "team",
      teamName: "Team 1"
    },
    {
      id: 3,
      to: "3w43tt33",
      from: "34355w",
      type: "invite",
      status: "pending",
      target: "team",
      teamName: "Team 1"
    },
    {
      id: 4,
      to: "3w43tt33",
      from: "34355w",
      type: "invite",
      status: "pending",
      target: "team",
      teamName: "Team 1"
    },
  ];

  const groupInvites = [
    {
        id: 1,
        to: "3w43tt33",
        from: "34355w",
        type: "invite",
        status: "pending",
        target: "group",
        teamName: "Team 1",
        groupName: "Group 1"
      },
    {
        id: 2,
        to: "3w43tt33",
        from: "34355w",
        type: "invite",
        status: "pending",
        target: "group",
        teamName: "Team 1",
        groupName: "Group 1"
      },
    {
        id: 3,
        to: "3w43tt33",
        from: "34355w",
        type: "invite",
        status: "pending",
        target: "group",
        teamName: "Team 1",
        groupName: "Group 1"
      },
    {
        id: 4,
        to: "3w43tt33",
        from: "34355w",
        type: "invite",
        status: "pending",
        target: "group",
        teamName: "Team 1",
        groupName: "Group 1"
      },
  ]
  return (
    <div className="">
      <div>
        <div className="font-semibold text-blue-400 px-3 py-2">
          Team Invites
        </div>
        {teamInvites.map((notification) => (
          <NotificationItem notification={notification} />
        ))}
      </div>
      <div>
        <div className="font-semibold text-blue-400 px-3 py-2">
          Group Invites
        </div>

        {groupInvites.map((notification) => (
          <NotificationItem notification={notification} />
        ))}

      </div>
    </div>
  );
};

export default NotificationList;
