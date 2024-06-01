import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Paginator } from "primereact/paginator";
import { messages } from "../../api/constants";
import { Toast } from "primereact/toast";
import { validateFields } from "./Validation";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { getccpto, updateccpto } from "../../store/slice/ccptoSlice";

const Ccpto = () => {
  const searchQuery = useSelector((state: any) => state.search.query);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const modeOfPayments = [...messages.modeofpayments, { name: "Pending", code: "PENDING" },];
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

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <Calendar
        value={new Date(rowData[field.field]) || null}
        style={{ width: "150px" }}
        disabled={rowData._id !== selectedRowId}
        onChange={(e: any) => handleDateChange(e.value, field.field)}
      />
    );
  };

  const handleDateChange = (value: Date, field: string) => {
    setData((prevData: any) =>
      prevData.map((row: any) => {
        if (row._id === selectedRowId) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleDropdownChange = (e: any, id: any, field: any) => {
    const { value } = e;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        return { ...row, [field]: value.code };
      }
      return row;
    });
    setData(newData);
  };

  const renderDropdown = (rowData: any, field: any) => {
    const selectedValue = modeOfPayments.find(
      (option) => option.code === rowData.modeofpayment
    );
    return (
      <Dropdown
        value={selectedValue}
        options={modeOfPayments}
        optionLabel="name"
        placeholder="Select a Payment"
        disabled={rowData._id !== selectedRowId}
        onChange={(e) => handleDropdownChange(e, rowData._id, field.field)}
        style={{ width: "150px" }}
      />
    );
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
    const { isValid, missingFields } = validateFields(rowData);
    if (!isValid) {
      toast.current?.show({
        severity: "error",
        summary: messages.validationerror,
        detail: `${missingFields.join(", ")} is required`,
        life: 3000,
      });
      return;
    }
    const payload = {
      paymentReceivedDate: getFormattedDate(rowData.paymentReceivedDate),
      modeofpayment: rowData.modeofpayment,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateccpto(payload));
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
      <div className="flex gap-2 justify-content-center">
        {!selectedRowId && (
          <Button
            label="Edit"
            severity="warning"
            onClick={() => handleEdit(rowData)}
          />
        )}
        {selectedRowId === rowData._id && (
          <>
            <Button
              label="Save"
              severity="success"
              onClick={() => handleSave(rowData)}
            />
            <Button label="Cancel" severity="danger" onClick={handleCancel} />
          </>
        )}
      </div>
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(
        getccpto({ limit: rows, offset: page * rows, search: searchQuery })
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

  const rowClassName = (rowData:any) => {
    if(['PENDING'].includes(rowData.modeofpayment)){
      return 'red'
    }
    return 'green';
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <Toast ref={toast} />
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh" rowClassName={rowClassName}>
        <Column field="ats.sno" header="S.No"></Column>
        <Column field="ats.date" header="Date"></Column>
        <Column field="ats.transname" header="Transport Name"></Column>
        <Column field="ats.trucknumber" header="Truck Number"></Column>
        <Column field="vmatcommision" header="VMAT Commission"></Column>
        <Column field="crossing" header="Crossing"></Column>
        <Column field="ack.expense" header="Expense"></Column>
        <Column field="pending" header="Pending"></Column>
        <Column
          field="paymentReceivedDate"
          header="Payment Received Date"
          body={renderDatePicker}
        ></Column>
        <Column
          field="modeofpayment"
          header="Mode Of Payment"
          body={renderDropdown}
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

export default Ccpto;
