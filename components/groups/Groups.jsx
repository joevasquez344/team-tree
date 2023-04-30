import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { createGroup, getUserGroups } from "../../utils/api/teams";
import AddButton from "../buttons/AddButton";
import GroupButton from "../buttons/GroupButton";
import Cards from "../cards/Cards";
import GroupCardContent from "../cards/teams/GroupCardContent";
import Modal from "../layout/Modal";
import TeamsHeader from "../teams/TeamsHeader";
import Group from "./Group";
import UserCards from "../users/UserCards";
import CreateGroupForm from "./CreateGroupForm";
import Loader from "../Loader";
import CreateGroupMessage from "./CreateGroupMessage";
import { useTeams } from "../../context/TeamsContext";

const Groups = () => {
  const { team, groups, groupsLoading } = useTeams();
  const [show, setShow] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);
  
  return (
    <div>

      <Modal show={show} onClose={() => setShow(false)}>
        <CreateGroupForm team={team} />
      </Modal>
    </div>
  );
};

export default Groups;
