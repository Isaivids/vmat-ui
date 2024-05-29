import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSearchQuery } from "../../store/slice/searchSlice";
import { clearUser } from "../../store/slice/userSlice";
const logout = require("../../assets/logout.svg").default;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = [
    {
      name: "AMT & Truck Details",
      to: "/amt",
      image: require("../../assets/ico1.svg").default,
    },
    {
      name: "Truck Advance",
      to: "/advance",
      image: require("../../assets/ico3.svg").default,
    },
    {
      name: "Acknowledgement / POD",
      to: "/ack",
      image: require("../../assets/ico2.svg").default,
    },
    {
      name: "Transport Balance payment",
      to: "/payment",
      image: require("../../assets/ico4.svg").default,
    },
    {
      name: "Transport Details",
      to: "/transport",
      image: require("../../assets/ico5.svg").default,
    },
    {
      // name : 'Commission Crossing Pending from Truck Owner',
      name : 'Commission Crossing Pending',
      to: "/ccpto",
      image: require("../../assets/ico4.svg").default,
    },
    {
      name : "Transport Crossing Payment",
      to: "/tcp",
      image: require("../../assets/ico5.svg").default,
    }
  ];

  const logoutProfile = () =>{
    sessionStorage.removeItem('idToken');
    dispatch(clearUser());
    navigate('/');
  }

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
                onClick={() => dispatch(clearSearchQuery())}
                className={({ isActive }) => isActive ? 'active-link flex gap-2 align-items-center' : 'non-active-link flex gap-2 align-items-center'}
              >
                <img src={x.image} alt="VMAT" />
                <span>{x.name}</span>
              </NavLink>
            );
          })}
      </div>
      <div className="flex align-items-center gap-2 pb-5 p-2 cursor-pointer	" onClick={logoutProfile}>
        <img src={logout} alt="VMAT" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
