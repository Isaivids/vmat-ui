import React, { useCallback, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAck, updateAck } from "../../store/slice/ackSlice";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { formatDate, getACK, messages } from "../../api/constants";
import { Checkbox } from "primereact/checkbox";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Button } from "primereact/button";
import { downloadPDF } from "../tcp/document";
const Ack = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // chekcbox
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [filteredData, setFilteredData]: any = useState([]);
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

  const renderCheckbox = (rowData: any, field: string, parent: any) => {
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

  const calculateUpdatedRow = (updatedRow: any) => {
    let addThree = updatedRow.addThree;
    if ([3, 4].includes(updatedRow.ats.modeofadvance)) {
      updatedRow.pendingamountfromtruckowner =
        addThree + Number(updatedRow.expense);
      updatedRow.finaltotaltotruckowner =
        Number(updatedRow.ats.transbln) - Number(updatedRow.tdsack) +
        Number(updatedRow.expense) -
        Number(updatedRow.podcharge);
    } else {
      updatedRow.pendingamountfromtruckowner = 0;
      // updatedRow.pendingamountfromtruckowner = Number(updatedRow.ats.truckbln) + (Number(addThree) + Number(expense) + Number(halting));
      updatedRow.finaltotaltotruckowner =
        updatedRow.ats.truckbln -
        Number(updatedRow.tdsack) - 
        Number(addThree) -
        Number(updatedRow.podcharge);
    }
    return updatedRow;
  };

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        if(field === 'rtgsnumber'){
          return updatedRow;
        }
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
        const updatedRow = { ...row, [field]: value.code };
        return calculateUpdatedRow(updatedRow);
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
      acknowledgementReceivedDate: rowData.acknowledgementReceivedDate
        ? getFormattedDate(rowData.acknowledgementReceivedDate)
        : "",
      hidevc: rowData.hidevc,
      hidevcm: rowData.hidevcm,
      hidetc: rowData.hidetc,
      expense: Number(rowData.expense),
      finaltotaltotruckowner: Number(rowData.finaltotaltotruckowner),
      paymentReceivedDate: rowData.paymentReceivedDate
        ? getFormattedDate(rowData.paymentReceivedDate)
        : "",
      modeofpayment: rowData.modeofpayment,
      podcharge: rowData.podcharge,
      rtgsnumber: rowData.rtgsnumber,
      tdsack: Number(rowData.tdsack),
      _id: rowData._id,
      ats: rowData.ats,
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
        value={rowData[field.field] || ''}
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
    let dropValues: any = [];
    let selectedValue: any;
    if (field.field === "podcharge") {
      dropValues = messages.podCharge;
      selectedValue = dropValues.find(
        (option: any) => option.code === rowData.podcharge
      );
    } else {
      dropValues = messages.modeofpayments;
      selectedValue = dropValues.find(
        (option: any) => option.code === rowData.modeofpayment
      );
    }

    return (
      <CommonDropdown
        selectedValue={selectedValue}
        rowData={rowData}
        field={field}
        modeOfPayments={dropValues}
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
      const ackdata = await dispatch(
        getAck({ limit: rows, offset: page * rows, search: searchQuery })
      );
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
    if (["PENDING", "", null, undefined].includes(rowData.modeofpayment)) {
      return "red";
    }
    return "green";
  };

  useEffect(() => {
    filterDataFunction(data, showPending, showCompleted);
  }, [data, showPending, showCompleted]);

  const filterDataFunction = (
    data: any,
    showPending: boolean,
    showCompleted: boolean
  ) => {
    const filtered = data.filter((row: any) => {
      if (
        showPending &&
        [null, "", undefined, "PENDING"].includes(row.modeofpayment)
      ) {
        return true;
      }
      if (
        showCompleted &&
        ![null, "", undefined, "PENDING"].includes(row.modeofpayment)
      ) {
        return true;
      }
      return false;
    });
    setFilteredData(filtered);
  };

  const handleCheckboxChange2 = (e: any) => {
    const { name, checked } = e.target;
    if (name === "pending") {
      setShowPending(checked);
      filterDataFunction(data, checked, showCompleted);
    } else if (name === "completed") {
      setShowCompleted(checked);
      filterDataFunction(data, showPending, checked);
    }
  };

  // Compute totals for each column
  const computeTotal = (field:any) => {
    return data
      .reduce((acc:any, item:any) => acc + (parseFloat(item[field]) || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <div className="flex justify-content-between">
        <Button
          label="Download"
          severity="secondary"
          onClick={() =>
            downloadPDF(selectedProducts, getACK(), searchQuery, 4)
          }
          disabled={selectedProducts.length <= 0}
          className="mb-2"
        />
        <div className="flex align-items-center my-3">
          <Checkbox
            inputId="pending"
            name="pending"
            checked={showPending}
            onChange={handleCheckboxChange2}
            className="mr-2"
          />
          <label htmlFor="pending" className="mr-4">
            Pending
          </label>
          <Checkbox
            inputId="completed"
            name="completed"
            checked={showCompleted}
            onChange={handleCheckboxChange2}
            className="mr-2"
          />
          <label htmlFor="completed" className="mr-4">
            Completed
          </label>
        </div>
      </div>
      <DataTable
        value={filteredData}
        showGridlines
        scrollable
        scrollHeight="70vh"
        rowClassName={rowClassName}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
      >
        <Column selectionMode="multiple"></Column>
        <Column
          field="ats.sno"
          header="S.No"
          style={{ minWidth: "100px" }}
        ></Column>
        <Column
          field="ats.date"
          header="Date"
          body={(rowData: any) => formatDate(rowData.ats.date)}
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
          field="tdsack"
          header="TDS deduction 1%"
          body={renderInput}
        ></Column>
        <Column field="ats.lateday" header="Late Delivery"></Column>
        <Column field="ats.halting" header="Halting"></Column>
        <Column field="expense" header="Expense" body={renderInput}></Column>
        <Column
          field="podcharge"
          header="POD Charge"
          body={renderDropdown}
        ></Column>
        <Column
          field="vmatcrossing"
          body={(rowData) => renderCheckbox(rowData, "hidevc", "vmatcrossing")}
          header="VMAT Crossing"
        ></Column>
        <Column
          field="vmatcommision"
          body={(rowData) =>
            renderCheckbox(rowData, "hidevcm", "vmatcommision")
          }
          header="VMAT Commission"
        ></Column>
        <Column
          field="transcrossing"
          body={(rowData) => renderCheckbox(rowData, "hidetc", "transcrossing")}
          header="Transport Crossing"
        ></Column>
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
          footer={`${computeTotal('finaltotaltotruckowner')}`}
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
        <Column
          field="rtgsnumber"
          header="RTGS Number"
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
        rowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};

export default Ack;
