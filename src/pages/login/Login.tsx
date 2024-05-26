import React from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <NavLink to={"/amt"}>Go To Dashboard</NavLink>
    </div>
  );
};

export default Login;
