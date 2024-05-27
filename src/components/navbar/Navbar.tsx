import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../store/slice/searchSlice";
const logo = require("../../assets/logo.svg").default;
const Navbar = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
  const navigate = useNavigate();
  const [search, setSearch] = useState('')
  const avatarClick = () => {
    navigate("/");
  };

  const dispatch = useDispatch();

  const handleSearchChange = (event:any) => {
    setSearch(event.target.value)
  };

  const handleSearch = () =>{
    dispatch(setSearchQuery(search));
  }

  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])
  

  return (
    <div className="navbar flex primary w-full align-items-center justify-content-between px-3">
      <div className="logo flex gap-1 align-items-center">
        <img src={logo} alt="VMAT" />
      </div>
      <div className="dd">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            type="text"
            placeholder="Type something to search"
            value={search}
            onChange={handleSearchChange}
            className="form-control ip"
            style={{ width: "300px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </IconField>
      </div>
      <div className="flex align-items-center gap-2">
        <Avatar label="A" size="normal" shape="circle" onClick={avatarClick} />
      </div>
    </div>
  );
};

export default Navbar;
