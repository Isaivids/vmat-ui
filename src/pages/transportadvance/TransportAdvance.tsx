import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import CommonDatePicker from "../../components/calender/CommonDatePicker";
import CommonDropdown from "../../components/dropdown/CommonDropdown";
import { gettransportadvance, updateTransportAdvance } from "../../store/slice/transportadvance";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";

const TransportAdvance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const searchQuery = useSelector((state: any) => state.search.query);
  const modeOfPayments = messages.modeofpayments;
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
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

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const onInputBlur = (id: any, field: any) => {
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        if (field === "plusorminus") {
          const updatedRow = { ...row, [field]: 0 };
          return updatedRow;
        }
      }
      return row;
    });
    setData(newData);
  };
  

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ["remarks","rtgsnumber"].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? undefined : "num"}
        onBlur={() => onInputBlur(rowData._id, field.field)}
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
      loadunloadchar: Number(rowData.loadunloadchar),
      tyrasporterpaidamt: Number(rowData.tyrasporterpaidamt),
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: getFormattedDate(rowData.paymentreceiveddate),
      remarks : rowData.remarks,
      extraloadingwagespaidbydriver : Number(rowData.extraloadingwagespaidbydriver),
      loadingwagespending : Number(rowData.loadingwagespending),
      rtgsnumber : rowData.rtgsnumber,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateTransportAdvance(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item:any) => item._id === rowData._id);
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

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(gettransportadvance({ limit: rows, offset: page * rows, search: searchQuery }));
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

  const rowClassName = (rowData:any) => {
    if([null,'',undefined].includes(rowData.paymentreceiveddate) || [null,'',undefined].includes(rowData.modeofpayment)){
      return 'red'
    }
    return 'green';
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh" rowClassName={rowClassName}>
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
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="ats.transadv" header="Transport Advance"></Column>
        <Column
          field="loadingwagespending"
          header="Loading Wages"
          body={renderInput}
        ></Column>
        <Column
          field="extraloadingwagespaidbydriver"
          header="Extra loading wages paid by driver"
          body={renderInput}
        ></Column>
        <Column
          field="transporterpaidadvanceamount"
          header="Transporter Paid Advance Amount"
        ></Column>
        <Column
          field="remarks"
          header="Remarks"
          body={renderInput}
        ></Column>
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

export default TransportAdvance;
