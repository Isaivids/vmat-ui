import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { formatDate, messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import {
  getvmataccount,
  getVmatAccountTotals,
  updatevmataccount,
} from "../../store/slice/vmataccount";
import CustomButtonComponent from "../../components/button/CustomButtonComponent";

const VmatAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const searchQuery = useSelector((state: any) => state.search);
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const [totals, setTotals]:any = useState()
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
        if (field === "vmatexpense") {
          const updatedRow = { ...row, [field]: value };
          const result = updatedRow.vmatcrossing + updatedRow.vmatcommision;
          updatedRow.income = result;
          updatedRow.profit = result - Number(updatedRow.vmatexpense);
          return updatedRow;
        }
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
      vmatexpense: Number(rowData.vmatexpense),
      reason: rowData.reason,
      tdsdeduction: rowData.tdsdeduction,
      income: rowData.income,
      profit: rowData.profit,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updatevmataccount(payload));
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
  // Compute totals for each column
  const computeTotal = () => {
    return Number(totals.totalIncome || 0) - Number(totals.totalVmatExpense || 0)
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getvmataccount({
          limit: rows,
          offset: page * rows,
          search: searchQuery,
        })
      );
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalDocuments);
      }
      if (trcukData.payload.error) {
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

  const fetchTotals = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getVmatAccountTotals({
          search: searchQuery,
        })
      );
      if (trcukData.payload.data && !trcukData.payload.error) {
        setTotals(trcukData.payload.data);
      }
      if (trcukData.payload.error) {
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
  }, [dispatch, searchQuery]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchTotals()
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData, fetchTotals]);


  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
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
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column
          field="vmatcommision"
          header="VMAT Commission"
          footer={totals.totalVmatCommision || 0}
        ></Column>
        <Column
          field="vmatcrossing"
          header="VMAT Crossing"
          footer={totals.totalVmatCrossing || 0}
        ></Column>
        <Column
          field="tdsdeduction"
          header="TDS Deduction"
          // body={renderInput}
          footer={totals.totalTdsDeduction || 0}
        ></Column>
        <Column
          field="vmatexpense"
          header="Vmat Expense"
          body={renderInput}
          footer={totals.totalVmatExpense || 0}
        ></Column>
        <Column field="reason" header="Reason" body={renderInput}></Column>
        <Column
          field="income"
          header="VMAT Income"
          footer={totals.totalIncome || 0}
        ></Column>
        {/* <Column field="profit" header="VMAT Profit"></Column> */}
        <Column
          header="Actions"
          body={renderButton}
          style={{ minWidth: "200px", right: "0", position: "sticky" }}
          footer={
            <span className="text-red-500 font-bold text-sm">{`PROFIT : ${computeTotal()}`}</span>
          }
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
