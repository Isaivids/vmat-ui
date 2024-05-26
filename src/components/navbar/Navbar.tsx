import React from "react";
import "./Navbar.scss";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
const logo = require("../../assets/logo.svg").default;
const Navbar = () => {
  const navigate = useNavigate();

  const avatarClick = () =>{
    navigate('/')
  }
  return (
    <div className="navbar flex primary w-full align-items-center justify-content-between px-3">
      <div className="logo flex gap-1 align-items-center">
        <img src={logo} alt="VMAT" />
      </div>
      <div className="flex align-items-center gap-2">
        <Avatar label="A" size="normal" shape="circle" onClick={avatarClick}/>
      </div>
    </div>
  );
};

export default Navbar;
