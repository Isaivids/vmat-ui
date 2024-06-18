import React, { useCallback, useEffect, useState } from "react";
import "./Navbar.scss";
import { Avatar } from "primereact/avatar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../store/slice/searchSlice";
import { AppDispatch } from "../../store/store";
import { getUserInfo } from "../../store/slice/userSlice";
import { Calendar } from "primereact/calendar";
const logo = require("../../assets/logo.svg").default;

const Navbar = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const userDetails = useSelector((state: any) => state.user);
  const [details, setDetails]: any = useState({});
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [fromDate, setFromdate] = useState(null);
  const [toDate, setTodate] = useState(null);
  const getUserInfoDetails = useCallback(async () => {
    const result: any = await dispatch(getUserInfo());
    try {
      if (!result.payload.error) {
        setDetails(result.payload.data);
      }
    } catch (error) {}
  }, [dispatch]);

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const formatDate = (date: any) => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const handleSearch = () => {
    dispatch(
      setSearchQuery({
        search: search,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      })
    );
  };

  useEffect(() => {
    setSearch(searchQuery.query);
    setFromdate(searchQuery.fromdate);
    setTodate(searchQuery.toDate);
  }, [searchQuery]);

  useEffect(() => {
    if (Object.keys(userDetails.body).length !== 0) {
      setDetails(userDetails.body.data);
    } else {
      getUserInfoDetails();
    }
  }, [getUserInfoDetails, userDetails.body]);

  return (
    <div className="navbar flex primary w-full align-items-center justify-content-between px-3">
      <div className="logo flex gap-1 align-items-center">
        <img src={logo} alt="VMAT" />
      </div>
      <div
        className="dd flex align-items-center gap-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      >
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            type="text"
            placeholder="Type something to search"
            value={search}
            onChange={handleSearchChange}
            className="form-control ip"
            style={{ width: "300px" }}
          />
        </IconField>
        <Calendar
          placeholder="From Date"
          value={fromDate}
          onChange={(e: any) => setFromdate(e.value)}
        />
        <Calendar
          placeholder="To Date"
          value={toDate}
          onChange={(e: any) => setTodate(e.value)}
        />
      </div>
      <div className="flex align-items-center gap-2">
        <span className="text-scy font-semibold	uppercase">
          {details?.username}
        </span>
        <Avatar
          label={details?.username?.substring(0, 1)}
          size="normal"
          shape="circle"
        />
      </div>
    </div>
  );
};

export default Navbar;
