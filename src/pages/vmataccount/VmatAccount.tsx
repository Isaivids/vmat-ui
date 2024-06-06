import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import { getvmataccount, updatevmataccount } from "../../store/slice/vmataccount";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";

const VmatAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const searchQuery = useSelector((state: any) => state.search.query);
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
  //customsearch
  // const [dates, setDates]:any = useState({
  //   startDate: null,
  //   endDate: null
  // });

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

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ["reason"].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? undefined : "num"}
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

  const handleSave = async (rowData: any) => {
    const payload = {
      vmatexpense : Number(rowData.vmatexpense),
      reason : rowData.reason,
      tdsdeduction : rowData.tdsdeduction,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updatevmataccount(payload));
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

  // const onDateChange = (e:any,field:any) =>{
  //   setDates((prevDates:any) => ({
  //     ...prevDates,
  //     [field]: e.value
  //   }));
  // }

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(getvmataccount({ limit: rows, offset: page * rows, search: searchQuery }));
      // const trcukData = await dispatch(getvmataccount({ limit: rows, offset: page * rows, search: searchQuery, date : dates }));
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalDocuments);
      }
      if(trcukData.payload.error){
        toast.current?.show({
          severity: "error",
          summary: messages.error,
          detail: trcukData.payload.message || messages.loadfailure,
          life: 3000,
        });
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
      {/* <div className="flex gap-3 my-2">
        <Calendar
          value={dates.startDate}
          onChange={(e) => onDateChange(e,'startDate')}
          dateFormat="dd/mm/yy"
          placeholder="Select Date"
        />
        <Calendar
          value={dates.endDate}
          onChange={(e) => onDateChange(e,'endDate')}
          dateFormat="dd/mm/yy"
          placeholder="Select Date"
        />
      </div> */}
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
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
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="vmatcommision" header="VMAT Commission"></Column>
        <Column field="vmatcrossing" header="VMAT Crossing"></Column>
        <Column
          field="tdsdeduction"
          header="TDS Deduction"
          body={renderInput}
        ></Column>
        <Column
          field="vmatexpense"
          header="Vmat Expense"
          body={renderInput}
        ></Column>
        <Column
          field="reason"
          header="Reason"
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
        />
    </div>
  );
};

export default VmatAccount;
