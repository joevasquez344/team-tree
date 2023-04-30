import React from "react";

const ChatError = ({ chatName }) => {
  return (
    <div className="text-white h-screen w-full relative p-5">
      <div className="absolute bottom-64">
        <div className="text-3xl font-bold mb-4">{chatName}</div>
        <div className="flex items-center space-x-1">
          <div>This is the beginning of chat history with</div>{" "}
          <div className="font-semibold text-green-500">{chatName}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatError;
