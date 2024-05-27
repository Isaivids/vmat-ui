import React from "react";
import "./Loader.scss";
const logo = require("../../assets/logo.svg").default;

const Loader = () => {
  return (
    <div className="loader-container">
      <img className="loader-image" src={logo} alt="Loader" />
    </div>
  );
};

export default Loader;
