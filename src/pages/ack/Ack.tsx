import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getAck, updateAck } from "../../store/slice/ackSlice";
import { Paginator } from "primereact/paginator";
const Ack = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);
  const searchQuery = useSelector((state: any) => state.search.query);

  const modeOfPayments = [
    { name: "Cash", code: "CASH" },
    { name: "Internet", code: "INT" },
    { name: "UPI", code: "UPI" },
  ];
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

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        const expense = Number(updatedRow.expense);
        const lateday = Number(updatedRow.ats.lateday);
        const halting = Number(updatedRow.ats.halting);
        updatedRow.finaltotaltotruckowner = expense + lateday * halting;
        return updatedRow;
      }
      return row;
    });
    setData(newData);
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
      acknowledgementReceivedDate: getFormattedDate(
        rowData.acknowledgementReceivedDate
      ),
      expense: Number(rowData.expense),
      finaltotaltotruckowner: Number(rowData.finaltotaltotruckowner),
      paymentReceivedDate: getFormattedDate(rowData.paymentReceivedDate),
      modeofpayment: rowData.modeofpayment,
      _id: rowData._id,
    };
    // Dispatch action to save data
    try {
      const response = await dispatch(updateAck(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item: any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
        }
        setSelectedRowId(null);
      }
    } catch (error) {
      console.log(error);
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
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
      />
    );
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <Calendar
        value={new Date(rowData[field.field]) || null}
        style={{ width: "100px" }}
        disabled={rowData._id !== selectedRowId}
        onChange={(e: any) => handleDateChange(e.value, field.field)}
      />
    );
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

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-content-center">
        {!selectedRowId && (
          <Button
            label="Edit"
            severity="warning"
            onClick={() => {
              setSelectedRowId(rowData._id);
              setBackupData([...data]);
            }}
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
      const ackdata = await dispatch(getAck({ limit: rows, offset: page, search: searchQuery }));
      if (Array.isArray(ackdata.payload.data) && !ackdata.payload.error) {
        setData(ackdata.payload.data);
        setTotalPage(ackdata.payload.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
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
        <Column field="ats.trucknumber" header="Truck No"></Column>
        <Column field="ats.transname" header="Trans Name"></Column>
        <Column field="ats.truckbln" header="Truck Bln"></Column>
        <Column field="expense" header="Expense" body={renderInput}></Column>
        <Column field="ats.lateday" header="Late Delv"></Column>
        <Column field="ats.halting" header="Halting"></Column>
        <Column field="vmatcrossing" header="VMAT Crossing"></Column>
        <Column field="vmatcommision" header="VMAT Commission"></Column>
        <Column field="transcrossing" header="Trans Crossing"></Column>
        <Column
          field="ats.twopay"
          header="2Pay Trans Bln."
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="pendingamountfromtruckowner"
          header="Pending Amt From Truck Own"
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="finaltotaltotruckowner"
          header="Final Total to Truck Own"
          style={{ minWidth: "200px" }}
        ></Column>
        <Column
          field="paymentReceivedDate"
          header="payment Recv Date"
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

export default Ack;
