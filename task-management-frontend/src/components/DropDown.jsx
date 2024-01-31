import React from "react";

const DropDown = ({ options, onChange, name }) => {
  return (
    <select
      className="outline-0 text-black rounded-xl w-1/4 md:w-[10rem] ps-2 pb-1 text-sm lg:text-base cursor-pointer"
      onChange={onChange}
      name={name}
    >
      {options.map((data, index) => (
        <option value={data.value} key={index}>
          {data.label}
        </option>
      ))}
    </select>
  );
};

export default DropDown;
