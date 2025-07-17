import React from "react";
import { Link } from "react-router-dom";
import Button from "../checkout/Button";

const Admin = ({ children }) => {
  return (
    <div>
      <h2 className="mb-8">Admin panel</h2>
      {children}
      <div className="mt-36">
        <Link to="/admin">
          <Button text="Back" variant="secondary"/>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
