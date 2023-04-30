import React, { useState } from "react";
import ModalOverlay from "./layout/ModalOverlay";

const Popup = ({ children, closePopup, popup }) => {
  return (
    <>
      {popup && <ModalOverlay closeModal={closePopup} />}
      {popup && children}
    </>
  );
};

export default Popup;
