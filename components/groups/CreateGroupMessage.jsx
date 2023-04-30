import React from "react";
import GroupButton from "../buttons/GroupButton";
import AddButton from "../buttons/AddButton";

const CreateGroupMessage = ({ openPopup }) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center p-5 ">
        <div className="relative flex items-center mb-2">
          <GroupButton />
          <div className="absolute bottom-0 right-0">
            <AddButton />
          </div>
        </div>
        <div
          onClick={openPopup}
          className="text-blue-400 font-semibold mb-2 px-5 py-2 shadow rounded hover:bg-blue-100   transition ease-in-out cursor-pointer duration-200"
        >
          Create Group
        </div>
        <div className="text-center text-gray-500 xl:w-1/2">
          Create a team to view each other's daily tasks, and collaborate in
          groups and meetings.
        </div>
      </div>
    </div>
  );
};

export default CreateGroupMessage;
