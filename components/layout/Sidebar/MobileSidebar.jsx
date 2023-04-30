import React from "react";

const MobileSidebar = ({ teams }) => {
  return (
    <div className="bg-gray-800 relative flex flex-col  p-3 h-screen">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center space-x-3 py-3 border-b border-b-gray-700">
          <div className="bg-green-500 h-8 w-8 flex items-center justify-center text-white font-bold rounded-sm">
            {team?.name?.split("")[0].toUpperCase()}
          </div>
          <div className="text-gray-300">{team.name}</div>
        </div>
      ))}

      <div className="flex items-center  border-t border-t-gray-600 left-0 right-0 pt-3 px-3 space-x-3 absolute bottom-3">
        <div className="bg-gray-700 h-6 w-6 flex items-center justify-center text-white font-bold rounded-full">
          <PlusIcon />
        </div>
      <div className="text-gray-300">Create Team</div>
      </div>
    </div>
  );
};

const PlusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export default MobileSidebar;
