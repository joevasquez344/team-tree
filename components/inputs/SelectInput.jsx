import React from "react";

const SelectInput = ({ handleChange, input, options, styles, options }) => {
  return (
    <select
      onChange={handleChange}
      value={input}
      className={`rounded w-full font-semibold py-2 px-3 text-gray-300 bg-gray-700 cursor-pointer leading-tight focus:outline-none focus:shadow-outline ${styles}`}
    >
      {options.map((option) => (
        <option className={styles}  value="Project Manager">
         {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
