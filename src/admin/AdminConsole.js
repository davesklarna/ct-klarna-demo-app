import React from "react";
import { Link } from "react-router-dom";

const AdminConsole = () => {
  return (
    <div>
      <Link to="admin/orders">
        <button className="text-xl hover:text-blue-400">Orders list</button>
      </Link>
    </div>
  );
};

export default AdminConsole;
