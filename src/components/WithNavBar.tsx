import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const WithNavBar = () => {
  return (
    <div>
      <div className="w-100">
        <Navbar />
      </div>
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default WithNavBar;
