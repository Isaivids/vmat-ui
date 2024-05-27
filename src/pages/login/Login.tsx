import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useNavigate } from "react-router-dom";
const logo = require("../../assets/logo.svg").default;

const Login = () => {
  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/amt");
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-content-center align-items-center">
        <div className="col-6 p-4 flex flex-column gap-3">
          <div className="flex-auto">
            <label htmlFor="username" className="text-pmy">
              Username
            </label>
            <InputText id="username" keyfilter="int" className="w-full" />
          </div>
          <div className="flex-auto">
            <label htmlFor="password" className="text-pmy">
              Password
            </label>
            <InputText id="password" keyfilter="num" className="w-full" />
          </div>
          <Button
            label="Login"
            severity="secondary"
            onClick={navigateToDashboard}
          />
        </div>
      </div>
      <div className="flex-1 bg-pmy justify-content-center align-items-center hidden sm:flex">
        <img src={logo} alt="VMAT" />
      </div>
    </div>
  );
};

export default Login;
