import React from "react";

const ButtonLink = ({ onClick, children }) => {
  return (
    <button
      className="text-blue-600 text-left hover:text-blue-400 mb-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
