import React, { useState } from "react";

const useSelect = () => {
  const [selectInput, setSelectInput] = useState("");

  const handleSelectChange = (e) => {
    setInput(e.currentTarget.value);
  };
  return {handleSelectChange, selectInput};
};

export default useSelect;
