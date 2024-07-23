import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getbytwopay, updateByTwoPay } from "../../store/slice/bytwopaySlice";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { formatDate, getTwoPayDetails, initialrows, messages, paginationRows } from "../../api/constants";
import CommonDatePicker from "../calender/CommonDatePicker";
import CommonDropdown from "../dropdown/CommonDropdown";
import CustomButtonComponent from "../button/CustomButtonComponent";
import { Button } from "primereact/button";
import { downloadPDF } from "../../pages/tcp/document";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";

const AdvTwopay = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const modeOfPayments = messages.modeofpayments;
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const userDetails = useSelector((state: any) => state.user);
  const [rowColor, setRowColor]:any = useState([])
  // chekcbox
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  //seection
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  const onInputChange2 = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderTextarea = (rowData: any, field: any) => {
    return (
      <>
      {rowData._id !== selectedRowId ? <span>{rowData[field.field] || ''}</span> : 
        <InputTextarea
          disabled={rowData._id !== selectedRowId}
          value={rowData[field.field] || ''}
          onChange={(e) => onInputChange2(e, rowData._id, field.field)}
          rows={1} 
          cols={27}
          autoResize
        />
      }
      </>
    );
  };

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        const transAdvance = Number(updatedRow.ats.transadv);
        const luxwages = Number(updatedRow.luxwages);
        updatedRow.total = transAdvance + luxwages;
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={["rtgsnumber","remarks"].includes(field.field) ? undefined : "num"}
      />
    );
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

  const getFormattedDate = (inputDate: any) => {
    if (["", null, undefined].includes(inputDate)) {
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
  const handleSave = async (rowData: any) => {
    const payload = {
      luxwages: Number(rowData.luxwages),
      total: Number(rowData.total),
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: getFormattedDate(rowData.paymentreceiveddate),
      rtgsnumber: rowData.rtgsnumber,
      remarks: rowData.remarks,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateByTwoPay(payload));
      if (!response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
          const updatedRowColor = rowColor.map((item: any) => {
            if (item._id === rowData._id) {
              return { ...item, modeofpayment: response.payload.data.modeofpayment };
            }
            return item;
          });   
          setRowColor(updatedRowColor);
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

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const handleCancel = () => {
    if (backupData) {
      setData(backupData);
      setBackupData(null);
    }
    setSelectedRowId(null);
  };

  const onDateChange = (e: any, id: any, field: any) => {
    const value = e.value;
    const newData: any = data.map((row: any) => {
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

  const renderDropdown = (rowData: any, field: any) => {
    const selectedValue = messages.modeofpayments.find(
      (option: any) => option.code === rowData.modeofpayment
    );
    return (
      <CommonDropdown
        selectedValue={selectedValue}
        rowData={rowData}
        field={field}
        modeOfPayments={modeOfPayments}
        selectedRowId={selectedRowId}
        handleDropdownChange={onDropdownChange}
      />
    );
  };

  const getAdvanceType = (type: any) => {
    const mode = messages.transportAdvanceTypes.find(
      (mode) => mode.code === type.ats.transaddvtype
    );
    return mode ? mode.name : "";
  };

  const getType = useCallback(() => {
    if (showPending && showCompleted) {
        return 3;
    } else if (showCompleted) {
        return 2;
    } else if (showPending) {
        return 1;
    } else {
        return 0;
    }
}, [showCompleted, showPending]);

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getbytwopay({ limit: rows, offset: page * rows, search: searchQuery,ftype: getType() })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setRowColor(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalDocuments);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.loadfailure,
        life: 3000,
      });
    }
  }, [dispatch, getType, page, rows, searchQuery]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  const rowClassName = (rowData: any) => {
    const color:any = rowColor.filter((x:any) => x._id === rowData._id);
    if ([null, "", undefined, "PENDING"].includes(color[0].modeofpayment)) {
      return "red";
    }
    return "green";
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    if (name === "pending") {
      setShowPending(checked);
    } else if (name === "completed") {
      setShowCompleted(checked);
    }
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <div className="flex justify-content-between">
        <Button
          label="Download"
          severity="secondary"
          className="my-3 text-bold"
          onClick={() =>
            downloadPDF(selectedProducts, getTwoPayDetails(), searchQuery, 3)
          }
          disabled={selectedProducts.length <= 0}
        />
        <div className="flex align-items-center my-3">
          <Checkbox
            inputId="pending"
            name="pending"
            checked={showPending}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="pending" className="mr-4">
            Pending
          </label>
          <Checkbox
            inputId="completed"
            name="completed"
            checked={showCompleted}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="completed" className="mr-4">
            Completed
          </label>
        </div>
      </div>
      <DataTable
        value={data}
        showGridlines
        scrollable
        scrollHeight="80vh"
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
          field="ats.truckname"
          header="Truck Name"
          style={{ minWidth: "100px" }}
        ></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.from" header="From"></Column>
        <Column field="ats.to" header="To"></Column>
        <Column field="ats.transf" header="Transport Freight"></Column>
        <Column
          field="ats.transaddvtype"
          body={(rowData: any) => getAdvanceType(rowData)}
          header="Transporter advance type to Truck"
        ></Column>
        <Column field="advanceamount" header="Transport Advance"></Column>
        <Column
          field="luxwages"
          header="Loading/Unloading Extra Wages"
          body={renderInput}
        ></Column>
        <Column
          field="remarks"
          header="Remarks"
          body={renderTextarea}
        ></Column>
        <Column field="total" header="Advance Amount Paid to Truck"></Column>
        <Column
          field="paymentreceiveddate"
          header="Payment Received Date"
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
        rowsPerPageOptions={paginationRows}
      />
    </div>
  );
};

export default AdvTwopay;
