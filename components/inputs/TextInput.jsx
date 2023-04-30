import React from "react";

const TextInput = ({ handleInputChange, input, placeholder }) => {
  return (
    <input
      onChange={handleInputChange}
      value={input}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
