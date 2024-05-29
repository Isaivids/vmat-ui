import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { addAts, getAts, updateats } from "../../store/slice/atsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { validateFields } from "./validations";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { messages } from "../../api/constants";

const Amt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [newRowAdded, setNewRowAdded] = useState(false);
  const searchQuery = useSelector((state: any) => state.search.query);
  const modeOfAdvance = [
    { name: "By VMAT", code: 1 },
    { name: "By Transport", code: 2 },
    { name: "By TwoPay", code: 3 },
  ];
  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const onPageChange = (event: any) => {
    setPage(event.page);
    setFirst(event.first);
    setRows(event.rows);
  };
  // ----------end of pagination
  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const onDateChange = (e: any, id: any, field: any) => {
    const value = e.value;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isNumberField = [
      "truckf",
      "transf",
      "vmatf",
      "transadv",
      "truckadv",
      "truckbln",
      "transbln",
      "twopay",
      "truckloadwt",
      "halting",
    ].includes(field.field);
    const isMt = ['truckloadwt'].includes(field.field)
    return (
      <div className="flex align-items-center">
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isNumberField ? "num" : "alphanum"}
        style={{ width: "150px" }}
      />
      {isMt && <span className="text-bold">mt</span>}
      </div>
    );
  };

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-content-center">
        {!selectedRowId && (
          <Button
            label="Edit"
            severity="warning"
            onClick={() => handleEdit(rowData._id)}
          />
        )}
        {selectedRowId === rowData._id && (
          <>
            <Button
              label="Save"
              severity="success"
              onClick={() => handleSave(rowData._id)}
            />
            <Button
              label="Cancel"
              severity="danger"
              onClick={() => handleCancel(rowData._id)}
            />
          </>
        )}
      </div>
    );
  };

  const handleEdit = (id: any) => {
    const originalRowData = data.find((row: any) => row._id === id);
    setOriginalData(originalRowData);
    setSelectedRowId(id);
  };

  const getFormatteddate = (inputDate: any) => {
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return localDate;
  };

  const getNewdataPayload = (inputObject: any) => {
    const outputObject = {
      sno: inputObject.sno,
      date: getFormatteddate(inputObject.date),
      truckname: inputObject.truckname,
      trucknumber: inputObject.trucknumber,
      transname: inputObject.transname,
      from: inputObject.from,
      to: inputObject.to,
      truckadv: Number(inputObject.truckadv),
      repdate: getFormatteddate(inputObject.repdate),
      unloaddate: getFormatteddate(inputObject.unloaddate),
      lateday: inputObject.lateday,
      halting: inputObject.halting,
      truckf: Number(inputObject.truckf),
      transf: Number(inputObject.transf),
      vmatf: Number(inputObject.vmatf),
      vmatadv: Number(inputObject.vmatadv),
      modeofadvance : Number(inputObject.modeofadvance),
      transadv: Number(inputObject.transadv),
      truckbln: Number(inputObject.truckbln),
      transbln: Number(inputObject.transbln),
      twopay: Number(inputObject.twopay),
      truckloadwt: Number(inputObject.truckloadwt),
    };
    return outputObject;
  };

  const createNewdata = async (data: any) => {
    const payload = getNewdataPayload(data);
    try {
      const response = await dispatch(addAts(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex(
          (item: any) => item._id === response.payload.data._id
        );
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
        }
        setSelectedRowId(null);
        toast.current?.show({
          severity: "success",
          summary: messages.success,
          detail: messages.updateoraddsuccess,
          life: 3000,
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.updateoraddfailure,
        life: 3000,
      });
    }
  };

  const handleSave = async (id: any) => {
    const rowData = data.find((row: any) => row._id === id);
    const { isValid, missingFields } = validateFields(rowData);

    if (!isValid) {
      toast.current?.show({
        severity: "error",
        summary: messages.validationerror,
        detail: `${missingFields.join(", ")} is required`,
        life: 3000,
      });
      return;
    }
    if (newRowAdded) {
      createNewdata(data.find((row: any) => row._id === id));
      setNewRowAdded(false);
    } else {
      let payload: any = getNewdataPayload(
        data.find((row: any) => row._id === id)
      );
      payload["_id"] = id;
      try {
        const response = await dispatch(updateats(payload));
        if (response.payload.data && !response.payload.error) {
          const index = data.findIndex(
            (item: any) => item._id === response.payload.data._id
          );
          if (index !== -1) {
            data[index]._id = response.payload.data._id;
          }
          setSelectedRowId(null);
          toast.current?.show({
            severity: "success",
            summary: messages.success,
            detail: messages.updateoraddsuccess,
            life: 3000,
          });
        }
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: messages.error,
          detail: messages.updateoraddfailure,
          life: 3000,
        });
      }
    }
    setSelectedRowId(null);
    setOriginalData({});
  };

  const handleCancel = (id: any) => {
    if (newRowAdded) {
      setData(data.filter((row: any) => row._id !== id));
      setNewRowAdded(false);
    } else {
      const restoredData = data.map((row: any) =>
        row._id === id ? originalData : row
      );
      setData(restoredData);
    }
    setSelectedRowId(null);
    setOriginalData({});
  };

  const addNewRow = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const nextSno =
      data.reduce((maxSno: any, row: any) => {
        const sno = parseInt(row.sno);
        return sno > maxSno ? sno : maxSno;
      }, 0) + 1;

    const newRow = {
      _id: `new-${nextSno}`, 
      sno: nextSno.toString() + `/` + month + `-` + year,
      date: currentDate,
      truckname: "",
      trucknumber: "",
      transname: "",
      from: "",
      to: "",
      truckadv: 0,
      repdate: null,
      unloaddate: null,
      lateday: 0,
      halting: 0,
      truckf: 0,
      transf: 0,
      vmatf: 0,
      vmatadv : 0,
      modeofadvance: 0,
      transadv: 0,
      truckbln: 0,
      transbln: 0,
      twopay: 0,
      truckloadwt: 0,
    };
    setData([newRow,...data]);
    setSelectedRowId(newRow._id);
    setNewRowAdded(true);
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <Calendar
        value={rowData[field.field]}
        onChange={(e) => onDateChange(e, rowData._id, field.field)}
        disabled={rowData._id !== selectedRowId}
        style={{ width: "150px" }}
      />
    );
  };

  const onDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value.code };
      }
      return row;
    });
    setData(newData);
  };

  const renderDropdown = (rowData: any, field: any) => {
    const selectedValue = modeOfAdvance.find(
      (option) => option.code === rowData.modeofadvance
    );
    return (
      <Dropdown
        value={selectedValue}
        onChange={(e) => onDropdownChange(e, rowData._id, field.field)}
        options={modeOfAdvance}
        optionLabel="name"
        placeholder="Select a Advance"
        disabled={rowData._id !== selectedRowId}
        style={{ width: "150px" }}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const atsData = await dispatch(
        getAts({ limit: rows, offset: page, search: searchQuery })
      );
      if (Array.isArray(atsData.payload.data) && !atsData.payload.error) {
        const formattedData = atsData.payload.data.map((item: any) => ({
          ...item,
          date: new Date(item.date),
          repdate: item.repdate ? new Date(item.repdate) : null,
          unloaddate: item.unloaddate ? new Date(item.unloaddate) : null,
        }));
        setData(formattedData);
        setTotalPage(atsData.payload.pagination.totalPages);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.loadfailure,
        life: 3000,
      });
    }
  }, [dispatch, page, rows, searchQuery]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  return (
    <>
      <Toast ref={toast} />
      <div className="p-2" style={{ overflowX: "auto" }}>
        <Button
          label="New"
          severity="success"
          onClick={addNewRow}
          className="mb-2"
        />
        <DataTable
          value={data}
          showGridlines
          scrollable
          scrollHeight="80vh"
          emptyMessage="No records found"
        >
          <Column
            field="sno"
            style={{ minWidth: "100px" }}
            header="S.No"
          ></Column>
          <Column
            field="date"
            style={{ minWidth: "100px" }}
            header="Date"
            body={renderDatePicker}
          ></Column>
          <Column
            field="truckname"
            header="Truck Name"
            body={renderInput}
          ></Column>
          <Column
            field="trucknumber"
            header="Truck Number"
            body={renderInput}
          ></Column>
          <Column
            field="transname"
            header="Transport Name"
            body={renderInput}
          ></Column>
          <Column field="from" header="From" body={renderInput}></Column>
          <Column field="to" header="To" body={renderInput}></Column>
          <Column
            field="repdate"
            header="Reporting Date"
            body={renderDatePicker}
          ></Column>
          <Column
            field="unloaddate"
            header="Unload Date"
            body={renderDatePicker}
            style={{ minWidth: "150px" }}
          ></Column>
          <Column field="lateday" header="Late Day" body={renderInput}></Column>
          <Column field="halting" header="Halting" body={renderInput}></Column>
          <Column
            field="truckf"
            header="Truck Freight"
            body={renderInput}
          ></Column>
          <Column
            field="vmatf"
            header="VMAT Freight"
            body={renderInput}
          ></Column>
          <Column
            field="transf"
            header="Transport Freight"
            body={renderInput}
          ></Column>
          <Column
            field="transadv"
            header="Transport Advance"
            body={renderInput}
          ></Column>
          <Column
            field="vmatadv"
            header="VMAT Advance"
            body={renderInput}
          ></Column>
          <Column
            field="modeofadvance"
            header="Mode Of Advance"
            body={renderDropdown}
          ></Column>
          <Column
            field="truckadv"
            header="Truck Advance"
            body={renderInput}
          ></Column>
          <Column
            field="truckbln"
            header="Truck Balance"
            body={renderInput}
          ></Column>
          <Column
            field="transbln"
            header="Transport Balance"
            body={renderInput}
          ></Column>
          <Column field="twopay" header="2-Pay" body={renderInput}></Column>
          <Column
            field="truckloadwt"
            header="Truck Load Weight"
            body={renderInput}
          ></Column>
          <Column
            header="Actions"
            body={renderButton}
            style={{ width: "200px", right: "0", position: "sticky" }}
          ></Column>
        </DataTable>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default Amt;
