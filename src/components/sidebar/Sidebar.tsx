import React from "react";
import { NavLink } from "react-router-dom";
const logout = require("../../assets/logout.svg").default;

const Sidebar = () => {
  const menu = [
    {
      name: "AMT & Truck Details",
      to: "/amt",
      image: require("../../assets/ico1.svg").default,
    },
    {
      name: "Acknowledgement / POD",
      to: "/ack",
      image: require("../../assets/ico2.svg").default,
    },
    {
      name: "Truck Advance",
      to: "/advance",
      image: require("../../assets/ico3.svg").default,
    },
    {
      name: "Trans Crossing Payment",
      to: "/payment",
      image: require("../../assets/ico4.svg").default,
    },
    {
      name: "Transport Details",
      to: "/transport",
      image: require("../../assets/ico5.svg").default,
    },
  ];
  return (
    <div
      style={{ height: "calc(100vh - 60px)" }}
      className="primary pr-3 text-50 font-semibold flex flex-column justify-content-between"
    >
      <div className="flex flex-column gap-5 py-6">
        {menu.length &&
          menu.map((x: any, index: number) => {
            return (
              <NavLink
                to={x.to}
                key={index}
                className={({ isActive }) => isActive ? 'active-link flex gap-2 align-items-center' : 'non-active-link flex gap-2 align-items-center'}
              >
                <img src={x.image} alt="VMAT" />
                <span>{x.name}</span>
              </NavLink>
            );
          })}
      </div>
      <NavLink className="flex align-items-center gap-2 pb-5 p-2" to={'/'}>
        <img src={logout} alt="VMAT" />
        <span>Logout</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
