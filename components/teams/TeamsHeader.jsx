import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import CreateGroupForm from "../groups/CreateGroupForm";
import Modal from "../layout/Modal";
import { useTeams } from "../../context/TeamsContext";

const TeamsHeader = ({ tabs, tabClick }) => {
  const router = useRouter();
  const { teamLoading } = useTeams();
  return (
    <div>
      {teamLoading ? (
        <Skeleton
          className="h-6"
          baseColor="rgb(31 41 55)"
          count={1}
          width="200px"
          highlightColor="rgb(55 65 81)"
          enableAnimation={true}
          direction="rtl"
          duration={1}
        />
      ) : (
        router.query.teamId && (
          <div className="flex items-center h-12 bg-gray-800 font-semibold">
            {tabs?.map((tab) => (
              <div
                key={tab?.id}
                onClick={() => tabClick(tab)}
                className={`${
                  tab?.active ? " text-gray-500 bg-gray-300" : " text-gray-500"
                } hover:bg-gray-300 hover:text-gray-500  px-7 flex items-center justify-center h-full transition ease-in-out cursor-pointer duration-200`}
              >
                {tab?.name}
              </div>
            ))}
          </div>
        )
      )}

      {/* <Modal show={show} onClose={() => setShow(false)}>
        <CreateGroupForm team={team} />
      </Modal> */}
    </div>
  );
};

export default TeamsHeader;
