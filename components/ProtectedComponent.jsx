import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

const ProtectedComponent = ({ children }) => {
  const { authUser } = useAuth();
  const [show, setShow] = useState(authUser ? true : false);

  useEffect(() => {
    if (!authUser) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [authUser]);
  return <div>{show ? children : null}</div>;
};

export default ProtectedComponent;
