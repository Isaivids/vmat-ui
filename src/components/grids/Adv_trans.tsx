import React, { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getbytransporter,
  updateByTransporter,
} from "../../store/slice/bytransSlice";
import { Paginator } from "primereact/paginator";

const AdvTrans = () => {
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
          updatedRow.transadvtotruck = Number(wages + others);
        }
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    const isStringField = ["remarks"].includes(field.field);
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field]}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={isStringField ? "alphanum" : "num"}
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
    const payload = {
      wages: Number(rowData.wages),
      others: Number(rowData.others),
      transadvtotruck: Number(rowData.transadvtotruck),
      remarks: rowData.remarks,
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: getFormattedDate(rowData.paymentreceiveddate),
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateByTransporter(payload));
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

  const handleEdit = (rowData: any) => {
    setSelectedRowId(rowData._id);
    setBackupData([...data]);
  };

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2">
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
      <Calendar
        value={new Date(rowData[field.field]) || null}
        onChange={(e) => onDateChange(e, rowData._id, field.field)}
        style={{ width: "100px" }}
        disabled={rowData._id !== selectedRowId}
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
    const selectedValue = modeOfPayments.find(
      (option) => option.code === rowData.modeofpayment
    );
    return (
      <Dropdown
        value={selectedValue}
        onChange={(e) => onDropdownChange(e, rowData._id, field.field)}
        options={modeOfPayments}
        optionLabel="name"
        placeholder="Select a Payment"
        disabled={rowData._id !== selectedRowId}
        style={{ width: "150px" }}
      />
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const trcukData = await dispatch(getbytransporter({ limit: rows, offset: page, search: searchQuery }));
      if (Array.isArray(trcukData.payload.data) && !trcukData.payload.error) {
        setData(trcukData.payload.data);
        setTotalPage(trcukData.payload.pagination.totalPages);
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
          style={{ minWidth: "150px" }}
          header="S.No"
        ></Column>
        <Column
          field="ats.date"
          style={{ minWidth: "150px" }}
          header="Date"
        ></Column>
        <Column field="ats.truckname" header="Truck Name"></Column>
        <Column field="ats.transname" header="Trans Name"></Column>
        <Column field="ats.transf" header="Trans Freight"></Column>
        <Column field="ats.transadv" header="Trans Adv"></Column>
        <Column
          field="transadvtotruck"
          style={{ minWidth: "150px" }}
          header="Trans Adv to Truck"
        ></Column>
        <Column field="wages" header="Wages" body={renderInput}></Column>
        <Column field="others" header="Others" body={renderInput}></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
        <Column
          field="paymentreceiveddate"
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

export default AdvTrans;
