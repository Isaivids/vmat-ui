import { Button } from "primereact/button";
import React from "react";
import "./Navbar.scss";
import { Avatar } from "primereact/avatar";
const logo = require("../../assets/logo.svg").default;
const Navbar = () => {
  return (
    <div className="navbar flex primary w-full align-items-center justify-content-between px-3">
      <div className="logo flex gap-1 align-items-center">
        <img src={logo} alt="VMAT" />
      </div>
      <div className="flex align-items-center gap-2">
        <Avatar label="A" size="normal" shape="circle" />
      </div>
    </div>
  );
};

export default Navbar;
