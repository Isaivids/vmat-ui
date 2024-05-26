import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { addAts, getAts, updateats } from "../../store/slice/atsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Dropdown } from "primereact/dropdown";

const Amt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const yesorno = [
    { name: "YES", code: "Yes" },
    { name: "NO", code: "No" },
  ];
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [newRowAdded, setNewRowAdded] = useState(false);

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

  const renderInput = (rowData: any, field: any) => {
    const isNumberField = [
      "truckf",
      "transf",
      "vmatf",
      "truckad",
      "transadv",
      "truckbln",
      "transbln",
      "twopay",
      "truckloadwt",
    ].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isNumberField ? "num" : "alphanum"}
        style={{ width: "150px" }}
      />
    );
  };

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2">
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
      truckad: Number(inputObject.truckad),
      repdate: getFormatteddate(inputObject.repdate),
      unloaddate: getFormatteddate(inputObject.unloaddate),
      lateday: inputObject.lateday,
      halting: inputObject.halting,
      truckf: Number(inputObject.truckf),
      transf: Number(inputObject.transf),
      vmatf: Number(inputObject.vmatf),
      truckadv: Number(inputObject.truckad),
      transadv: Number(inputObject.transadv),
      truckbln: Number(inputObject.truckbln),
      transbln: Number(inputObject.transbln),
      twopay: Number(inputObject.twopay),
      truckloadwt: Number(inputObject.truckloadwt),
    };
    return outputObject;
  };

  const createNewdata = async (data: any) => {
    const payload = await getNewdataPayload(data);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (id: any) => {
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
        }
      } catch (error) {}
    }
    setSelectedRowId(null);
    setOriginalData({});
  };

  const handleCancel = (id: any) => {
    if (newRowAdded) {
      setData(data.filter((row: any) => row._id !== id));
      setNewRowAdded(false);
    } else {
      // Restore the original data for existing row
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
      _id: `new-${nextSno}`, // Temporary ID for the new row
      sno: nextSno.toString() + `/` + month + `-` + year,
      date: currentDate,
      truckname: "",
      trucknumber: "",
      transname: "",
      from: "",
      to: "",
      truckad: "",
      repdate: null,
      unloaddate: null,
      lateday: "",
      halting: "",
      truckf: "",
      transf: "",
      vmatf: "",
      truckadv: "",
      transadv: "",
      truckbln: "",
      transbln: "",
      twopay: "",
      truckloadwt: "",
    };
    setData([...data, newRow]);
    setSelectedRowId(newRow._id);
    setNewRowAdded(true);
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <Calendar
        value={rowData[field.field]}
        onChange={(e) => onDateChange(e, rowData._id, field.field)}
        disabled={rowData._id !== selectedRowId}
        style={{ width: "100px" }}
      />
    );
  };

  const renderDropdown = (rowData: any, field: any) => {
    const selectedValue = yesorno.find(
      (option) => option.code === rowData.halting
    );

    return (
      <Dropdown
        value={selectedValue}
        options={yesorno}
        optionLabel="name"
        onChange={(e) => onDropdownChange(e, rowData._id, field.field)}
        placeholder="Select a Yes/No"
        disabled={rowData._id !== selectedRowId}
        style={{ width: "100px" }}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const atsData = await dispatch(getAts());
      if (atsData.payload.data.length && !atsData.payload.error) {
        const formattedData = atsData.payload.data.map((item: any) => ({
          ...item,
          date: new Date(item.date),
          repdate: item.repdate ? new Date(item.repdate) : null,
          unloaddate: item.unloaddate ? new Date(item.unloaddate) : null,
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);
  return (
    <>
      <div className="p-2" style={{ overflowX: "auto" }}>
        <Button
          label="New"
          className="mb-2"
          severity="success"
          onClick={addNewRow}
        />
        <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
          <Column field="sno" style={{ minWidth: "100px" }} header="S.No"></Column>
          <Column field="date" style={{ minWidth: "100px" }} header="Date" body={renderDatePicker}></Column>
          <Column
            field="truckname"
            header="Truck Name"
            body={renderInput}
          ></Column>
          <Column
            field="trucknumber"
            header="Truck No"
            body={renderInput}
          ></Column>
          <Column
            field="transname"
            header="Trans Name"
            body={renderInput}
          ></Column>
          <Column field="from" header="From" body={renderInput}></Column>
          <Column field="to" header="To" body={renderInput}></Column>
          <Column field="truckad" header="Truck Ad" body={renderInput}></Column>
          <Column
            field="repdate"
            header="Rep. Date"
            body={renderDatePicker}
          ></Column>
          <Column
            field="unloaddate"
            header="Unload Date"
            body={renderDatePicker}
          ></Column>
          <Column field="lateday" header="Late Day" body={renderInput}></Column>
          <Column
            field="halting"
            header="Halting"
            body={renderDropdown}
          ></Column>
          <Column field="truckf" header="Truck F" body={renderInput}></Column>
          <Column field="transf" header="Trans F" body={renderInput}></Column>
          <Column field="vmatf" header="VMAT F" body={renderInput}></Column>
          <Column field="truckad" header="Truck Ad" body={renderInput}></Column>
          <Column
            field="transadv"
            header="Trans Ad"
            body={renderInput}
          ></Column>
          <Column
            field="truckbln"
            header="Truck Bin"
            body={renderInput}
          ></Column>
          <Column
            field="transbln"
            header="Trans Bin"
            body={renderInput}
          ></Column>
          <Column field="twopay" header="2-Pay" body={renderInput}></Column>
          <Column
            field="truckloadwt"
            header="Truck Load Wt"
            body={renderInput}
          ></Column>
          <Column
            header="Actions"
            body={renderButton}
            style={{ width: "200px", right: "0", position: "sticky" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default Amt;
