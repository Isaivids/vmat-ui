import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { formatDate, initialrows, messages, paginationRows } from "../../api/constants";
import { Toast } from "primereact/toast";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import {
  gettransportadvance,
  updateTransportAdvance,
} from "../../store/slice/transportadvance";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";
import { Checkbox } from "primereact/checkbox";

const TransportAdvance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const searchQuery = useSelector((state: any) => state.search);
  const modeOfPayments = messages.modeofpayments;
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const userDetails = useSelector((state: any) => state.user);
  const [rowColor, setRowColor]:any = useState([])
  // chekcbox
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
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

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.transporterpaidadvanceamount =
          Number(updatedRow.ats.transadv)
          - Math.abs(Number(updatedRow.tdstta)) +
          Number(updatedRow.loadingwages) +
            Number(updatedRow.extraloadingwagespaidbydriver);
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
        value={rowData[field.field] || ''}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? undefined : "num"}
        autoComplete="off"
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
      transporterpaidadvanceamount: Number(
        rowData.transporterpaidadvanceamount
      ),
      modeofpayment: rowData.modeofpayment,
      dateofadvancepayment: getFormattedDate(rowData.dateofadvancepayment),
      remarks: rowData.remarks,
      extraloadingwagespaidbydriver: Number(
        rowData.extraloadingwagespaidbydriver
      ),
      loadingwages : Number(rowData.loadingwages),
      rtgsnumber: rowData.rtgsnumber,
      tdstta: Number(rowData.tdstta),
      _id: rowData._id,
      ats: rowData.ats,
    };
    try {
      const response = await dispatch(updateTransportAdvance(payload));
      if (response.payload.data && !response.payload.error) {
        const index = backupData.findIndex((item: any) => item._id === rowData._id);
        const {
          transporterpaidadvanceamount,modeofpayment,dateofadvancepayment,
          remarks,extraloadingwagespaidbydriver,loadingwages,rtgsnumber,tdstta,_id
        } = response.payload.data;
        if (index !== -1) {
          // data[index]._id = response.payload.data._id;
          const updatedBackupData = backupData.map((item: any) =>
            item._id === rowData._id
              ? {
                ...rowData,
                transporterpaidadvanceamount: Number(
                  transporterpaidadvanceamount
                ),
                modeofpayment: modeofpayment,
                dateofadvancepayment: dateofadvancepayment,
                remarks: remarks,
                extraloadingwagespaidbydriver: Number(
                  extraloadingwagespaidbydriver
                ),
                loadingwages : Number(loadingwages),
                rtgsnumber: rtgsnumber,
                tdstta: Number(tdstta),
                _id: _id,
                }
              : item
          );
          setBackupData(updatedBackupData);
          const updatedRowColor = rowColor.map((item: any) => {
            if (item._id === rowData._id) {
              return { ...item, modeofpayment: response.payload.data.modeofpayment };
            }
            return item;
          });   
          setRowColor(updatedRowColor);
          setData([...updatedBackupData]);
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
      console.log(error)
      toast.current?.show({
        severity: "error",
        summary: messages.error,
        detail: messages.updateoraddfailure,
        life: 3000,
      });
    }
  };

  const handleEdit = (rowData: any) => {
    setBackupData(data);
    const filtered = data.filter((x: any) => x._id === rowData._id);
    setData(filtered);
    setSelectedRowId(rowData._id);
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
        gettransportadvance({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
          ftype : getType()
        })
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
    if(color.length){
      if ([null, "", undefined,'PENDING'].includes(color[0].modeofpayment)) {
        return "red";
      }
      return "green";
    }
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
      <DataTable
        value={data}
        showGridlines
        scrollable
        scrollHeight="80vh"
        rowClassName={rowClassName}
      >
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
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.from" header="From"></Column>
        <Column field="ats.to" header="To"></Column>
        <Column field="ats.transadv" header="Transport Advance"></Column>
        <Column
          field="tdstta"
          header="TDS deduction 1%"
          body={renderInput}
        ></Column>
        <Column field="loadingwages" body={renderInput} header="Loading Wages"></Column>
        <Column
          field="extraloadingwagespaidbydriver"
          header="Extra loading wages paid by driver"
          body={renderInput}
        ></Column>
        <Column
          field="transporterpaidadvanceamount"
          header="Transporter Paid Advance Amount"
        ></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
        <Column
          field="dateofadvancepayment"
          header="Date of Advance Payment"
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

export default TransportAdvance;
