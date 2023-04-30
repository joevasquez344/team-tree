import React, { useState } from "react";
import AvatarDropdown from "../users/AvatarDropdown";
import AvatarRow from "../users/AvatarRow";

const AvatarContainer = ({ group }) => {
  const [dropdown, setDropdown] = useState(false);
  const openDropdown = () => setDropdown(true);
  const closeDropdown = () => setDropdown(false);
  const styles = dropdown ? "h-96" : "h-28";
  return (
    <div className={`transition ease-in-out duration-200 `}>
      <AvatarRow
        openDropdown={openDropdown}
        closeDropdown={closeDropdown}
        dropdown={dropdown}
        group={group}
      />
      {dropdown && <AvatarDropdown users={group.users} />}
    </div>
  );
};

export default AvatarContainer;
