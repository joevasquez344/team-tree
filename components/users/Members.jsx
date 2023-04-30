import { useRouter } from "next/router";
import React from "react";

const Members = ({ members, type }) => {
  const router = useRouter();
  const handleMember = (username) => {
    if (type && type === "chat") {
      router.push(`/teams/${router.query.teamId}/chat/${username}`);

      return;
    }

    router.push(`/teams/${router.query.teamId}/members/${username}`);
  };
  return (
    <div className="h-full">
      {members?.map((member) => (
        <div
          key={member.id}
          onClick={() => handleMember(member.username)}
          className="flex items-center justify-between py-1 text-sm px-3 hover:bg-gray-700 transition ease-in-out cursor-pointer duration-200"
        >
          <div className="flex items-center  text-gray-400">
            <img
              className="h-6 w-6 rounded-full mr-3"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <div className="group-hover:text-blue-400 font-semibold mr-1">
              {member.name}
            </div>
            <div className="group-hover:text-blue-400">@{member.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
