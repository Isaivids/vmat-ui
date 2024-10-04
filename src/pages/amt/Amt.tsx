import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { addAts, deleteAts, getAts, updateats } from "../../store/slice/atsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { validateFields } from "./validations";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { initialrows, messages, paginationRows } from "../../api/constants";
import DialogAmt from "../../components/dialogamt/DialogAmt";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import ReceiptDialog from "../../pdf/ReceiptDialog";
import { generatePDF } from "../../api/pdfUtil";
import { updaterecentbill } from "../../store/slice/billSlice";
// import { generatePDF } from "../../api/pdfUtil";

const Amt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [originalData, setOriginalData]:any = useState();
  const [newRowAdded, setNewRowAdded] = useState(false);
  const searchQuery = useSelector((state: any) => state.search);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedData, setSelectedData]: any = useState({});
  const userDetails = useSelector((state: any) => state.user);
  const [receipt, setReceipt] = useState(false);
  const [latestSerial, setLatestSerial] = useState('');
  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(initialrows);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const onPageChange = (event: any) => {
    setPage(event.page);
    setFirst(event.first);
    setRows(event.rows);
  };
  // ----------end of pagination
  const tableContainerRef:any = useRef(null);

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const calcField = ["truckf", "transf", "truckadv", "transadv"];
    const newData = data.map((row: any) => {
      if (row._id === id) {
        let updatedRow = { ...row, [field]: value };
        if (calcField.includes(field)) {
          updatedRow = { ...row, [field]: value };
          updatedRow.truckbln = Number(updatedRow.truckf) - Number(updatedRow.truckadv);
          if(updatedRow.transbalancetype === 'TOPAY'){
            updatedRow.transbln = 0;
            updatedRow.twopay = Number(updatedRow.transf) - Number(updatedRow.transadv);
          }else if(updatedRow.transbalancetype === 'BALANCE'){
            updatedRow.transbln = Number(updatedRow.transf) - Number(updatedRow.transadv);
            updatedRow.twopay = 0;
          }
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

  const openReceiptDialog = (rowData: any) => {
    setReceipt(true);
    setSelectedData(rowData);
  };

  const accept = async(id:any) => {
    try {
      const response = await dispatch(deleteAts(id));
      if(response.payload.error === false){
        toast.current?.show({
          severity: "info",
          summary: "Confirmed",
          detail: response.payload.message,
          life: 3000,
        });
        fetchData();
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: 'Unable to do this operation now',
        life: 3000,
      });
    }
  };

  const confirm2 = (event: any,id:any) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept : () => accept(id),
    });
  };

  const getMemoOpen = async(rowData:any) =>{
    try {
      const body = {serialnumber : rowData.sno}
      const response = await dispatch(updaterecentbill(body));
      if(!response.payload.error){
        generatePDF(rowData,response.payload);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.updateoraddfailure,
        life: 3000,
      });
    }
  }

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-content-center">
        {!selectedRowId && (
          <>
            <Button
              label="Edit"
              severity="warning"
              onClick={() => handleEdit(rowData._id)}
            />
            <Button severity="danger" onClick={(event:any) => confirm2(event,rowData._id)}><i className="pi pi-trash"></i></Button>
            <Button label="Bill" severity="secondary" onClick={() => openReceiptDialog(rowData)}/>
            <Button label="Memo" onClick={() => getMemoOpen(rowData)} />
          </>
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
    setOriginalData(data);
    setSelectedRowId(id);
    const filtered = data.filter((x: any) => x._id === id);
    setData(filtered);
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
      deliverydate: getFormatteddate(inputObject.deliverydate),
      reportingdate: getFormatteddate(inputObject.reportingdate),
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

  const createNewdata = async (data1: any) => {
    const payload = getNewdataPayload(data1);
    try {
      const response = await dispatch(addAts(payload));
      if (response.payload.data && !response.payload.error) {
        setSelectedRowId(null);
        setOriginalData([response.payload.data,...originalData]);
        setLatestSerial(response.payload.latestSerial.sno);
        setData([response.payload.data,...originalData]);
        toast.current?.show({
          severity: "success",
          summary: messages.success,
          detail: messages.updateoraddsuccess,
          life: 3000,
        });
      }

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
      setSelectedRowId(null);
    } else {
      let payload: any = getNewdataPayload(
        data.find((row: any) => row._id === id)
      );
      payload["_id"] = id;
      try {
        const response = await dispatch(updateats(payload));
        if (response.payload.data && !response.payload.error) {
          const {
            sno,date,truckname,trucknumber,transname,from,to,truckadv,transaddvtype,repdate,
            unloaddate,deliverydate,reportingdate,lateday,halting,truckf,
            transf,vmatf,modeofadvance,transbalancetype,truckbalancetype,
            transadv,truckbln,transbln,twopay,truckloadwt,_id
          } = response.payload.data;
          setSelectedRowId(null);
          const updatedBackupData = originalData.map((item: any) =>
            item._id === response.payload.data._id
              ? {
                _id : _id,
                sno: sno,
                date: date,
                truckname: truckname,
                trucknumber: trucknumber,
                transname: transname,
                from: from,
                to: to,
                truckadv: Number(truckadv),
                transaddvtype: Number(transaddvtype),
                repdate: repdate,
                unloaddate: unloaddate,
                deliverydate: deliverydate,
                reportingdate: reportingdate,
                lateday: lateday,
                halting: halting,
                truckf: Number(truckf),
                transf: Number(transf),
                vmatf: Number(vmatf),
                modeofadvance: Number(modeofadvance),
                transbalancetype: transbalancetype,
                truckbalancetype: truckbalancetype,
                transadv: Number(transadv),
                truckbln: Number(truckbln),
                transbln: Number(transbln),
                twopay: Number(twopay),
                truckloadwt: Number(truckloadwt),
               }
              : item
          );
          setOriginalData(updatedBackupData);
          setLatestSerial(response.payload.latestSerial.sno);
          setData([...updatedBackupData]);
          toast.current?.show({
            severity: "success",
            summary: messages.success,
            detail: messages.updateoraddsuccess,
            life: 3000,
          });
        }
        setSelectedRowId(null);
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
      setNewRowAdded(false);
      setData(originalData);
    } else {
      setData(originalData);
    }
    setSelectedRowId(null);
    setOriginalData(null);
  };

  function generateUniqueId() {
    const now = new Date();
    const datePart = now.getFullYear().toString() + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + 
                     now.getDate().toString().padStart(2, '0') + 
                     now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0') + 
                     now.getSeconds().toString().padStart(2, '0') + 
                     now.getMilliseconds().toString().padStart(3, '0');
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomPart = Array.from({ length: 5 }, () => alphabets[Math.floor(Math.random() * alphabets.length)]).join('');
    return datePart + randomPart;
  }

  const getNextSerialNumber = (sno:string) => {
    const [currentSerialNumber, currentMonth] = sno.split('-').map(Number);
    const date = new Date();
    const currentMonthFromSystem = (date.getMonth() + 1).toString().padStart(2, '0');
    let newSerialNumber,newMonth;
    if (currentMonthFromSystem !== currentMonth.toString().padStart(2, '0')) {
      newSerialNumber = 1;
      newMonth = currentMonthFromSystem;
    } else {
      newSerialNumber = currentSerialNumber + 1;
      newMonth = currentMonth.toString().padStart(2, '0');
    }
    const newSno = `${newSerialNumber.toString().padStart(2, '0')}-${newMonth}`;
    return newSno;
  }

  const addNewRow = () => {
    const newRow = {
      _id : generateUniqueId(),
      sno: getNextSerialNumber(latestSerial),      
      date: "",
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
      deliverydate: "",
      reportingdate: "",
    };
    setOriginalData(data)
    setData([newRow]);
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
        isAdmin={userDetails}
      />
    );
  };

  const onDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData = data.map((row: any) => {
      if (row._id === id) {
        // return { ...row, [field]: value.code };
        const updatedRow:any = { ...row, [field]: value.code };
        if ([1,2].includes(updatedRow.modeofadvance)) {
          updatedRow.truckbalancetype = 'BALANCE';
          updatedRow.transbalancetype = 'BALANCE';
          updatedRow.transbln = Number(updatedRow.transf) - Number(updatedRow.transadv);
          updatedRow.twopay = 0;
        }else if([3,4].includes(updatedRow.modeofadvance)){
          updatedRow.truckbalancetype = 'TOPAY';
          updatedRow.transbalancetype = 'TOPAY'
          updatedRow.transbln = 0;
          updatedRow.twopay = Number(updatedRow.transf) - Number(updatedRow.transadv);
        }
        if(updatedRow.transbalancetype === 'TOPAY'){
          updatedRow.transbln = 0;
          updatedRow.twopay = Number(updatedRow.transf) - Number(updatedRow.transadv);
        }else if(updatedRow.transbalancetype === 'BALANCE'){
          updatedRow.transbln = Number(updatedRow.transf) - Number(updatedRow.transadv);
          updatedRow.twopay = 0;
        }
        return updatedRow;
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
        setLatestSerial(atsData.payload.latestSerial.sno);
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
      <ConfirmPopup />
      <DialogAmt
        visible={visible}
        setVisible={setVisible}
        selectedData={selectedData}
      />
      <ReceiptDialog
        receipt={receipt}
        setReceipt={setReceipt}
        selectedData={selectedData}
      /> 
        <div className="p-2" style={{ overflowX: "auto" }} ref={tableContainerRef}>
        <Button
          label="New"
          severity="success"
          onClick={addNewRow}
          className="mb-2"
          disabled = {selectedRowId}
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
          <Column
            field="from"
            header="From"
            body={renderInput}
          ></Column>
          <Column
            field="to"
            header="To"
            body={renderInput}
          ></Column>
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
            field="reportingdate"
            header="Reporting Date"
            body={renderDatePicker}
          ></Column>
          <Column
            field="deliverydate"
            header="Delivery Date"
            body={renderDatePicker}
          ></Column>
          <Column
            field="lateday"
            header="Late delivery"
            body={renderInput}
          ></Column>
          <Column field="halting" header="Halting" body={renderInput}></Column>
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
          rowsPerPageOptions={paginationRows}
        />
      </div>
    </>
  );
};

export default Amt;