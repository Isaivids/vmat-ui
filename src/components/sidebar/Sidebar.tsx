import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSearchQuery } from "../../store/slice/searchSlice";
import { clearUser } from "../../store/slice/userSlice";
import { messages } from "../../api/constants";
import '../../App.scss';

const logout = require("../../assets/logout.svg").default;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.user);
  const [menu, setMenu]:any = useState(messages.menuList)

  const logoutProfile = () => {
    sessionStorage.removeItem('idToken');
    dispatch(clearUser());
    navigate('/');
  };

  useEffect(() => {
    if (userDetails && userDetails.body && userDetails.body.data && userDetails.body.data.admin) {
      setMenu((prevMenu: any) => [...prevMenu, messages.menuListVmat]);
    }
  }, [userDetails]);

  return (
    <div
      style={{ height: "calc(100vh - 60px)", overflowY: 'auto', minWidth: '270px' }}
      className="primary font-semibold flex flex-column justify-content-between"
    >
      <div className="flex flex-column gap-2 py-1 overflow-y-auto">
        {menu.length &&
          menu.map((x: any, index: number) => {
            return (
              <NavLink
                to={x.to}
                key={index}
                onClick={() => dispatch(clearSearchQuery())}
                className={({ isActive }) => isActive ? 'active-link flex align-items-center' : 'non-active-link flex align-items-center'}
              >
                <img src={x.image} alt="VMAT" />
                <span className={`uppercase ${x.color ? x.color : ''}`}>{x.name}</span>
              </NavLink>
            );
          })}
      </div>
      <div className="flex align-items-center gap-2 p-2 cursor-pointer" onClick={logoutProfile}>
        <img src={logout} alt="VMAT" />
        <span className="text-50">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
