import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { initialrows, messages, paginationRows } from "../../api/constants";
import { Toast } from "primereact/toast";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import { InputText } from "primereact/inputtext";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Button } from "primereact/button";
import { deletebankdetails, getbankdetail, updatebankdetail } from "../../store/slice/bankSlice";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

const BankDetails = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const userDetails = useSelector((state: any) => state.user);

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
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const stringFields = ['transportbranches','rtgsnumber'].includes(field.field)
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e: any) => onInputChange(e, rowData._id, field.field)}
        keyfilter={stringFields ? undefined : "num"}
      />
    );
  };

  const getFormattedDate = (inputDate: any) => {
    if(!inputDate){
      return;
    }
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return localDate;
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

  const handleSave = async (rowData: any) => {
    const payload = {
      paymentdate: getFormattedDate(rowData.paymentdate),
      advanceamount: Number(rowData.advanceamount),
      balanceamount: Number(rowData.balanceamount),
      transportbranches: rowData.transportbranches,
      rtgsnumber: rowData.rtgsnumber,
      _id: rowData._id,
    };
    try {
        const response = await dispatch(updatebankdetail(payload));
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
    } else {
      setData(data.filter((row: any) => row._id !== selectedRowId));
    }
    setSelectedRowId(null);
  };

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const accept = async(id:any) => {
    try {
      const response = await dispatch(deletebankdetails(id));
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

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <CustomButtonComponent
          rowData={rowData}
          selectedRowId={selectedRowId}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
        {!selectedRowId && <Button severity="danger" style={{height : '30px'}} onClick={(event:any) => confirm2(event,rowData._id)}><i className="pi pi-trash"></i></Button>}
      </div>
    );
  };

  const handleAddNewRow = () => {
    const newRow = {
      _id: new Date(),
      paymentdate: "",
      advanceamount: 0,
      balanceamount: 0,
      transportbranches: "",
      rtgsnumber: "",
    };
    setData([newRow, ...data]);
    setSelectedRowId(newRow._id);
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getbankdetail({ limit: rows, offset: page * rows, search: searchQuery })
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

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <ConfirmPopup />
      <Button
        label="Add New Row"
        severity="info"
        className="mb-2"
        onClick={handleAddNewRow}
      />
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
        <Column
          field="paymentdate"
          header="Payment Date"
          body={renderDatePicker}
        ></Column>
        <Column
          field="advanceamount"
          header="Advance Amount"
          body={renderInput}
        ></Column>
        <Column
          field="balanceamount"
          header="Balance Amount"
          body={renderInput}
        ></Column>
        <Column
          field="transportbranches"
          header="Transport Branches"
          body={renderTextarea}
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

export default BankDetails;
