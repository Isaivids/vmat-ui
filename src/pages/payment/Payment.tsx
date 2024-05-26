import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useState } from "react";
import dummyData from "../../assets/dummydata.json";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { getTransCrossing, updateTransAdvance } from "../../store/slice/transSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
const Payment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modeOfPayments = [
    { name: "Cash", code: "CASH" },
    { name: "Internet", code: "INT" },
    { name: "UPI", code: "UPI" },
  ];
  const [data, setData]: any = useState([]);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const [backupData, setBackupData]: any = useState(null);

  const onInputChange = (e: any, id: any, field: any) => {
    const { value } = e.target;
    const newData: any = data.map((row: any) => {
      if (row._id === id) {
        const updatedRow = { ...row, [field]: value };
        const transAdvance = Number(updatedRow.ats.transadv);
        const loadUnloadChar = Number(updatedRow.loadunloadchar);
        updatedRow.tyrasporterpaidamt = transAdvance + loadUnloadChar;
        return updatedRow;
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData._id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData._id, field.field)}
        keyfilter={"num"}
      />
    );
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

  const handleSave = async (rowData: any) => {
    const date = new Date(rowData.paymentreceiveddate);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    
    const payload = {
      loadunloadchar: Number(rowData.loadunloadchar),
      tyrasporterpaidamt: Number(rowData.tyrasporterpaidamt),
      modeofpayment: rowData.modeofpayment,
      paymentreceiveddate: localDate,
      _id: rowData._id,
    };
    try {
      const response = await dispatch(updateTransAdvance(payload));
      if (response.payload.data && !response.payload.error) {
        const index = data.findIndex((item:any) => item._id === rowData._id);
        if (index !== -1) {
          data[index]._id = response.payload.data._id;
        }
        setSelectedRowId(null);
      }
    } catch (error) {
      console.log(error);
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
      <Calendar
        value={new Date(rowData[field.field]) || null}
        onChange={(e) => onDateChange(e, rowData._id, field.field)}
        style={{ width: "100px" }}
        disabled={rowData._id !== selectedRowId}
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
      const trcukData = await dispatch(getTransCrossing());
      if (trcukData.payload.data.length && !trcukData.payload.error) {
        setData(trcukData.payload.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

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
        <Column field="ats.transname" header="Truck Name"></Column>
        <Column field="ats.trucknumber" header="Truck No"></Column>
        <Column field="ats.transf" header="Trans Freight"></Column>
        <Column field="ats.transadv" header="Trans Advance"></Column>
        <Column
          field="loadunloadchar"
          header="Lad Char/ UnloadChar"
          body={renderInput}
        ></Column>
        <Column
          field="tyrasporterpaidamt"
          header="Transprter Paid Adv Amt"
        ></Column>
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
    </div>
  );
};

export default Payment;
