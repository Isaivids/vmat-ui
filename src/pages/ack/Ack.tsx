import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAck, updateAck } from "../../store/slice/ackSlice";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { messages } from "../../api/constants";
import { Checkbox } from "primereact/checkbox";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
const Ack = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const searchQuery = useSelector((state: any) => state.search.query);
  const toast = useRef<Toast>(null);

  const modeOfPayments = messages.modeofpayments;
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
  // Checkbox state
  const handleCheckboxChange = (rowData: any, field: string) => {
    const updatedData = data.map((row: any) => {
      if (row._id === rowData._id) {
        const updatedRow = { ...row, [field]: !row[field] };
        return calculateUpdatedRow(updatedRow);
      }
      return row;
    });
    setData(updatedData);
  };

  const renderCheckbox = (rowData: any, field: string,parent:any) => {
    return (
      <div className="flex gap-3 align-items-center">
        <Checkbox
          checked={rowData[field]}
          disabled={rowData._id !== selectedRowId}
          onChange={() => handleCheckboxChange(rowData, field)}
        />
        <span>{rowData[parent]}</span>
      </div>
    );
  };

  const calculateUpdatedRow = (updatedRow:any) =>{
    const expense = Number(updatedRow.expense);
    const halting = Number(updatedRow.ats.halting);
    let addThree = 0;
    
    if ([1, 2].includes(updatedRow.modeofadvance)) {
      if (updatedRow.hidevc) {
        addThree += updatedRow.vmatcrossing;
      }
      if (updatedRow.hidevcm) {
        addThree += updatedRow.vmatcommision;
      }
      if (updatedRow.hidetc) {
        addThree += updatedRow.transcrossing;
      }
    } else {
      if (updatedRow.hidetc) {
        addThree += updatedRow.transcrossing;
      }
      if (updatedRow.hidevc) {
        addThree += updatedRow.vmatcrossing;
      }
      if (updatedRow.hidevcm) {
        addThree += updatedRow.vmatcommision;
      }
    }
    if(updatedRow.ats.modeofadvance === 3){
      updatedRow.pendingamountfromtruckowner = addThree;
      updatedRow.finaltotaltotruckowner = Number(updatedRow.ats.transbln) - Math.abs(expense);
  }else{
      updatedRow.pendingamountfromtruckowner = Number(updatedRow.ats.truckbln) -  (Math.abs(addThree) + Math.abs(expense) + Math.abs(halting));
      updatedRow.finaltotaltotruckowner = (updatedRow.ats.truckbln) - Math.abs(addThree);
  }
    // updatedRow.pendingamountfromtruckowner = updatedRow.ats.truckbln - (Math.abs(addThree) + Math.abs(expense) + Math.abs(lateday * halting));
    // updatedRow.finaltotaltotruckowner = updatedRow.ats.truckbln - Math.abs(addThree);
    return updatedRow
  }

  const onInputChange = (e: any, id: any, field: any) => {
  const { value } = e.target;
  const newData: any = data.map((row: any) => {
    if (row._id === id) {
      const updatedRow = { ...row, [field]: value };
      return calculateUpdatedRow(updatedRow);
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
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value.code };
      }
      return row;
    });
    setData(newData);
  };

  const getFormattedDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return localDate;
  };

  const handleSave = async (rowData: any) => {
    const payload = {
      acknowledgementReceivedDate: rowData.acknowledgementReceivedDate ? getFormattedDate(
        rowData.acknowledgementReceivedDate
      ) : '',
      hidevc : rowData.hidevc,
      hidevcm : rowData.hidevcm,
      hidetc : rowData.hidetc,
      expense: Number(rowData.expense),
      finaltotaltotruckowner: Number(rowData.finaltotaltotruckowner),
      paymentReceivedDate: rowData.paymentReceivedDate ? getFormattedDate(rowData.paymentReceivedDate) : '',
      reportingdate: rowData.reportingdate ? getFormattedDate(rowData.reportingdate) : '',
      deliverydate: rowData.deliverydate ? getFormattedDate(rowData.deliverydate) : '',
      modeofpayment: rowData.modeofpayment,
      rtgsnumber : rowData.rtgsnumber,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateAck(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
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
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.updateoraddfailure,
        life: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    }
    setSelectedRowId(null);
  };

  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
      />
    );
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

  const renderDropdown = (rowData: any, field: any) => {
    return (
      <CommonDropdown
        rowData={rowData}
        field={field}
        modeOfPayments={modeOfPayments}
        selectedRowId={selectedRowId}
        handleDropdownChange={onDropdownChange}
      />
    );
  };

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const renderButton = (rowData: any) => {
    return (
      <CustomButtonComponent
        rowData={rowData}
        selectedRowId={selectedRowId}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const ackdata = await dispatch(getAck({ limit: rows, offset: page * rows, search: searchQuery }));
      if (Array.isArray(ackdata.payload.data) && !ackdata.payload.error) {
        setData(ackdata.payload.data);
        setTotalPage(ackdata.payload.pagination.totalDocuments);
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

  const rowClassName = (rowData: any) => {
    if (["PENDING",'',null,undefined].includes(rowData.modeofpayment)) {
      return "red";
    }
    return "green";
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <DataTable value={data} showGridlines scrollable scrollHeight="70vh" rowClassName={rowClassName}>
        <Column
          field="ats.sno"
          header="S.No"
          style={{ minWidth: "100px" }}
        ></Column>
        <Column
          field="ats.date"
          header="Date"
          style={{ minWidth: "100px" }}
        ></Column>
        <Column
          field="acknowledgementReceivedDate"
          header="Ack.Rec Date"
          body={renderDatePicker}
        ></Column>
        <Column
          field="ats.truckname"
          header="Truck Name"
          style={{ minWidth: "150px" }}
        ></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.truckbln" header="Truck Balance"></Column>
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
        <Column field="ats.lateday" header="Late Delivery"></Column>
        <Column field="ats.halting" header="Halting"></Column>
        <Column field="expense" header="Expense" body={renderInput}></Column>
        <Column field="podcharge" header="POD Charge" body={renderInput}></Column>
        <Column field="vmatcrossing" body={(rowData) => renderCheckbox(rowData,'hidevc' ,'vmatcrossing')} header="VMAT Crossing"></Column>
        <Column field="vmatcommision" body={(rowData) => renderCheckbox(rowData,'hidevcm', 'vmatcommision')} header="VMAT Commission"></Column>
        <Column field="transcrossing" body={(rowData) => renderCheckbox(rowData,'hidetc', 'transcrossing')} header="Transport Crossing"></Column>
        <Column
          field="ats.twopay"
          header="By To Pay Transport Balance."
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="pendingamountfromtruckowner"
          header="Pending Amount From Truck Owner"
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="finaltotaltotruckowner"
          header="Final Total to Truck Owner"
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="paymentReceivedDate"
          header="Payment transfer to truck owner"
          body={renderDatePicker}
        ></Column>
        <Column
          field="modeofpayment"
          header="Mode Of Payment"
          body={renderDropdown}
        ></Column>
        <Column field="rtgsnumber" header="RTGS Number" body={renderInput}></Column>
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
  );
};

export default Ack;
