import React, { useCallback, useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getbytransporter,
  updateByTransporter,
} from "../../store/slice/bytransSlice";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { formatDate, getTransADV, messages } from "../../api/constants";
import CommonDatePicker from "../calender/CommonDatePicker";
import CommonDropdown from "../dropdown/CommonDropdown";
import CustomButtonComponent from "../button/CustomButtonComponent";
import { Button } from "primereact/button";
import { downloadPDF } from "../../pages/tcp/document";

const AdvTrans = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const modeOfPayments = messages.modeofpayments;
  const [selectedProducts, setSelectedProducts] = useState([]);
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
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        if (["wages", "others"].includes(field)) {
          const wages = Number(updatedRow.wages);
          const others = Number(updatedRow.others);
          const transAdv = Number(updatedRow.advanceamount);
          updatedRow.transadvtotruck =
            transAdv + Number(wages) + Number(others);
        }
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ["remarks", "rtgsnumber"].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? undefined : "num"}
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
      wages: Number(rowData.wages),
      others: Number(rowData.others),
      transadvtotruck: Number(rowData.transadvtotruck),
      remarks: rowData.remarks,
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: getFormattedDate(rowData.paymentreceiveddate),
      rtgsnumber: rowData.rtgsnumber,
      tdstka: Number(rowData.tdstka),
      _id: rowData._id,
      ats : rowData.ats
    };
    try {
      const response = await dispatch(updateByTransporter(payload));
      if (!response.payload.error) {
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
      />
    );
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

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getbytransporter({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
        })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
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
  }, [dispatch, page, rows, searchQuery]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  const rowClassName = (rowData: any) => {
    if ([null, "", undefined, "PENDING"].includes(rowData.modeofpayment)) {
      return "red";
    }
    return "green";
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <Button
        label="Download"
        severity="secondary"
        onClick={() => downloadPDF(selectedProducts, getTransADV(),searchQuery,2)}
        disabled={selectedProducts.length <= 0}
        className="mb-2"
      />
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
          style={{ minWidth: "150px" }}
          header="S.No"
        ></Column>
        <Column
          field="ats.date"
          body={(rowData:any) => formatDate(rowData.ats.date)}
          style={{ minWidth: "150px" }}
          header="Date"
        ></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.transf" header="Transport Freight"></Column>
        <Column field="advanceamount" header="Transport Advance"></Column>
        <Column field="tdstka" header="TDS deduction 1%" body={renderInput}></Column>
        <Column
          field="wages"
          header="Loading wages"
          body={renderInput}
        ></Column>
        <Column field="others" header="Others" body={renderInput}></Column>
        <Column
          field="transadvtotruck"
          style={{ minWidth: "150px" }}
          header="Transport Advance to Truck"
        ></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
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
        rowsPerPageOptions={[10, 20, 30]}
      />
    </div>
  );
};

export default AdvTrans;
