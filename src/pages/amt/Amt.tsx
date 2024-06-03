import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { addAts, getAts, updateats } from "../../store/slice/atsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { validateFields } from "./validations";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { messages } from "../../api/constants";
import DialogAmt from "../../components/dialogamt/DialogAmt";
import CommonDatePicker from "../../components/calender/CommonDatePicker";

const Amt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [newRowAdded, setNewRowAdded] = useState(false);
  const searchQuery = useSelector((state: any) => state.search.query);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedData, setSelectedData]: any = useState({});
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
    const calcField = ["truckf", "transf", "truckadv", "transadv"];
    const newData = data.map((row: any) => {
      if (row._id === id) {
        let updatedRow = { ...row, [field]: value };
        if (calcField.includes(field)) {
          updatedRow = { ...row, [field]: value };
          updatedRow.truckbln =
            Number(updatedRow.truckf) - Number(updatedRow.truckadv);
          updatedRow.transbln =
            Number(updatedRow.transf) - Number(updatedRow.transadv);
        }
        return updatedRow;
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
    const isMt = ["truckloadwt"].includes(field.field);
    return (
      <div className="flex align-items-center rel">
        <InputText
          disabled={rowData._id !== selectedRowId}
          value={rowData[field.field]}
          onChange={(e) => onInputChange(e, rowData._id, field.field)}
          keyfilter={isNumberField ? "num" : undefined}
          style={{ width: "150px" }}
        />
        {isMt && <span className="font-semibold abs">mt</span>}
      </div>
    );
  };

  const renderLinkToDialog = (rowData: any) => {
    return (
      <b
        className="cursor-pointer"
        onClick={() => {
          setVisible(true);
          setSelectedData(rowData);
        }}
      >
        {rowData.sno}
      </b>
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
    if ([null, undefined, ""].includes(inputDate)) {
      return "";
    } else {
      const date = new Date(inputDate);
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      return localDate;
    }
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
      transaddvtype: Number(inputObject.transaddvtype),
      repdate: getFormatteddate(inputObject.repdate),
      unloaddate: getFormatteddate(inputObject.unloaddate),
      lateday: inputObject.lateday,
      halting: inputObject.halting,
      truckf: Number(inputObject.truckf),
      transf: Number(inputObject.transf),
      vmatf: Number(inputObject.vmatf),
      modeofadvance: Number(inputObject.modeofadvance),
      transbalancetype: inputObject.transbalancetype,
      truckbalancetype: inputObject.truckbalancetype,
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
    } catch (error: any) {
      // toast.current?.show({
      //   severity: "error",
      //   summary: messages.error,
      //   detail: messages.updateoraddfailure,
      //   life: 3000,
      // });
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
      _id: new Date().getDate().toString(),
      sno: nextSno.toString() + `/` + month + `-` + year,
      date: currentDate,
      truckname: "",
      trucknumber: "",
      transname: "",
      from: "",
      to: "",
      truckadv: 0,
      transaddvtype: 0,
      repdate: null,
      unloaddate: null,
      lateday: 0,
      halting: 0,
      truckf: 0,
      transf: 0,
      vmatf: 0,
      modeofadvance: 0,
      transadv: 0,
      truckbln: 0,
      truckbalancetype: "",
      transbalancetype: "",
      transbln: 0,
      twopay: 0,
      truckloadwt: 0,
    };
    setData([newRow, ...data]);
    setSelectedRowId(newRow._id);
    setNewRowAdded(true);
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <CommonDatePicker
        rowData={rowData}
        field={field}
        selectedRowId={selectedRowId}
        onDateChange={onDateChange}
      />
    );
  };

  const onDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        // return { ...row, [field]: value.code };
        const updatedRow = { ...row, [field]: value.code };
        if(updatedRow.modeofadvance === 3){
          updatedRow.twopay = updatedRow.transbln
        }
        return updatedRow
      }
      return row;
    });
    setData(newData);
  };

  const renderDropdown = (rowData: any, field: any, type: string) => {
    let selectedValue: any;
    let dropdownValue: any = [];
    if (type === "modeofadvance") {
      selectedValue = messages.modeOfAdvance.find(
        (option) => option.code === rowData.modeofadvance
      );
      dropdownValue = messages.modeOfAdvance;
    } else if (type === "transaddvtype") {
      selectedValue = messages.transportAdvanceTypes.find(
        (option) => option.code === rowData.transaddvtype
      );
      dropdownValue = messages.transportAdvanceTypes;
    } else if (type === "truckbalancetype") {
      selectedValue = messages.modeofbalance.find(
        (option) => option.code === rowData.truckbalancetype
      );
      dropdownValue = messages.modeofbalance;
    } else if (type === "transbalancetype") {
      selectedValue = messages.modeofbalance.find(
        (option) => option.code === rowData.transbalancetype
      );
      dropdownValue = messages.modeofbalance;
    }

    return (
      <Dropdown
        value={selectedValue}
        onChange={(e) => onDropdownChange(e, rowData._id, field.field)}
        options={dropdownValue}
        optionLabel="name"
        placeholder="Select"
        disabled={rowData._id !== selectedRowId}
        style={{ width: "150px" }}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const atsData = await dispatch(
        getAts({ limit: rows, offset: page * rows, search: searchQuery })
      );
      if (Array.isArray(atsData.payload.data) && !atsData.payload.error) {
        const formattedData = atsData.payload.data.map((item: any) => ({
          ...item,
          date: new Date(item.date),
          repdate: item.repdate ? new Date(item.repdate) : null,
          unloaddate: item.unloaddate ? new Date(item.unloaddate) : null,
        }));
        setData(formattedData);
        setTotalPage(atsData.payload.pagination.totalDocuments);
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
      <DialogAmt
        visible={visible}
        setVisible={setVisible}
        selectedData={selectedData}
      />
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
          scrollHeight="70vh"
          emptyMessage="No records found"
        >
          <Column
            field="sno"
            body={renderLinkToDialog}
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
          {/* <Column field="from" header="From" body={renderInput}></Column>
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
          ></Column> */}
          <Column
            field="lateday"
            header="Late delivery"
            body={renderInput}
          ></Column>
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
            field="transaddvtype"
            header="Transporter Advance type to Truck"
            body={(rowData, field) =>
              renderDropdown(rowData, field, "transaddvtype")
            }
          ></Column>
          <Column
            field="transadv"
            header="Advance from transporter to VMAT/Truck"
            body={renderInput}
          ></Column>
          <Column
            field="modeofadvance"
            header="Mode of Advance to Truck"
            body={(rowData, field) =>
              renderDropdown(rowData, field, "modeofadvance")
            }
          ></Column>
          <Column
            field="truckadv"
            header="Truck Advance"
            body={renderInput}
          ></Column>
          <Column
            field="truckbalancetype"
            header="Truck Balance Type"
            body={(rowData, field) =>
              renderDropdown(rowData, field, "truckbalancetype")
            }
          ></Column>
          <Column
            field="truckbln"
            header="Truck Balance"
            // body={renderInput}
          ></Column>
          <Column
            field="transbalancetype"
            header="Transport Balance Type"
            body={(rowData, field) =>
              renderDropdown(rowData, field, "transbalancetype")
            }
          ></Column>
          <Column
            field="transbln"
            header="Transport Balance"
            // body={renderInput}
          ></Column>
          <Column field="twopay" header="By To Pay"></Column>
          <Column
            field="truckloadwt"
            header="Truck Load Weight"
            body={renderInput}
          ></Column>
          <Column
            header="Actions"
            body={renderButton}
            style={{ width: "150px", right: "0", position: "sticky" }}
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
