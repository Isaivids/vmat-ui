import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import { InputText } from "primereact/inputtext";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { deletecourierdetails, getcourierdetail, updatecourierdetails } from "../../store/slice/courierSlice";

const Courier = () => {
  const searchQuery = useSelector((state: any) => state.search);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const userDetails = useSelector((state: any) => state.user);

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
    const stringFields = ['remarks','couriersendingname','courierdetail'].includes(field.field)
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
    console.log(rowData)
    const payload = {
      couriersendingname: rowData.couriersendingname,
      courierdetail: rowData.courierdetail,
      debitamount: Number(rowData.debitamount),
      creditamount: Number(rowData.creditamount),
      remarks: rowData.remarks,
      date : getFormattedDate(rowData.date),
      _id: rowData._id,
    };
    try {
        const response = await dispatch(updatecourierdetails(payload));
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
      const response = await dispatch(deletecourierdetails(id));
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
      couriersendingname: "",
      courierdetail: "",
      remarks: "",
      debitamount: 0,
      creditamount: 0,
      date: '',
    };
    setData([newRow, ...data]);
    setSelectedRowId(newRow._id);
  };

    // Compute totals for each column
    const computeTotal = (field:any) => {
      return data
        .reduce((acc:any, item:any) => acc + (Number(item[field]) || 0), 0)
        .toFixed(2);
    };
    
    const calculateNetTotal = () => {
      const totalCredit = parseFloat(computeTotal('creditamount'));
      const totalDebit = parseFloat(computeTotal('debitamount'));
      const netTotal = totalCredit - totalDebit;
      return netTotal.toFixed(2);
    };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getcourierdetail({ limit: rows, offset: page * rows, search: searchQuery })
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
          field="date"
          header="Date"
          body={renderDatePicker}
        ></Column>
        <Column
          field="couriersendingname"
          header="Courier Address"
          body={renderTextarea}
        ></Column>
        <Column
          field="courierdetail"
          header="Courier Name & Number"
          body={renderTextarea}
          style={{minWidth : '200px'}}
        ></Column>
        <Column
          field="remarks"
          header="Remarks"
          body={renderTextarea}
        ></Column>
        <Column
          field="debitamount"
          header="Debit Amount"
          body={renderInput}
          footer={`Balance : ${calculateNetTotal()}`}
        ></Column>
        <Column
          field="creditamount"
          header="Credit Amount"
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

export default Courier;
