import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import dummyData from "../../assets/dummydata.json";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
const Ack = () => {
  const initialData: any = dummyData;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(initialData);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const modeOfPayments = [
    { name: "Cash", code: "CASH" },
    { name: "Internet", code: "INT" },
    { name: "UPI", code: "UPI" },
  ];
  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData.id !== selectedRowId}
        value={rowData[field.field] || ""}
        // onChange={(e) => onInputChange(e, rowData.id, field.field)}
      />
    );
  };

  const renderDatePicker = (rowData: any, field: any) => {
    return (
      <Calendar
        value={rowData[field.field]}
        style={{ width: "100px" }}
        disabled={rowData.id !== selectedRowId}
      />
    );
  };

  const renderDropdown = (rowData: any) => {
    return (
      <Dropdown
        // value={selectedCity}
        // onChange={(e) => setSelectedCity(e.value)}
        options={modeOfPayments}
        optionLabel="name"
        placeholder="Select a Payment"
        disabled={rowData.id !== selectedRowId}
      />
    );
  };

  const renderButton = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {!selectedRowId && (
          <Button label="Edit" onClick={() => setSelectedRowId(rowData.id)} />
        )}
        {selectedRowId === rowData.id && (
          <>
            <Button label="Save" onClick={() => setSelectedRowId(null)} />
            <Button label="Cancel" onClick={() => setSelectedRowId(null)} />
          </>
        )}
      </div>
    );
  };

  const calculateTranscrossing = (rowData: any) => {
    const transf = parseFloat(rowData.transf);
    const vmatf = parseFloat(rowData.vmatf);

    return transf - vmatf;
  };

  const calculateVMATCrossing = (rowData: any) => {
    const truckf = parseFloat(rowData.truckf);
    const vmatf = parseFloat(rowData.vmatf);

    return truckf - vmatf;
  };

  const calculateVMATComission = (rowData: any) => {
    const truckf = parseFloat(rowData.truckf);
    const commissionPercentage = 2;
    const commissionAmount = (truckf * commissionPercentage) / 100;
    return commissionAmount;
  };

  const calculatePendingAmountFromTruckOwn = (rowData: any) => {
    const val1 = calculateTranscrossing(rowData);
    const val2 = calculateVMATComission(rowData);
    const val3 = calculateVMATCrossing(rowData);
    return val1 + val2 + val3;
  };

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
        <Column field="sno" header="S.No"></Column>
        <Column field="date" header="Date"></Column>
        <Column
          field="acknRecdate"
          header="Ack.Rec Date"
          body={renderDatePicker}
        ></Column>
        <Column field="truckname" header="Truck Name"></Column>
        <Column field="truckno" header="Truck No" body={renderInput}></Column>
        <Column field="transname" header="Trans Name"></Column>
        <Column field="trckbin" header="Truck Bln"></Column>
        <Column field="expense" header="Expense" body={renderInput}></Column>
        <Column field="latedelv" header="Late Delv"></Column>
        <Column field="halting" header="Halting"></Column>
        <Column
          field="vmatcrossing"
          header="VMAT Crossing"
          body={calculateVMATCrossing}
        ></Column>
        <Column
          field="vmatcommission"
          header="VMAT Commission"
          body={calculateVMATComission}
        ></Column>
        <Column
          field="transcrossing"
          header="Trans Crossing"
          body={calculateTranscrossing}
        ></Column>
        <Column field="2paytransbln" header="2Pay Trans Bln."></Column>
        <Column
          field="pendingamtfromtruckown"
          header="Pending Amt From Truck Own"
          body={calculatePendingAmountFromTruckOwn}
        ></Column>
        <Column
          field="finaltotaltotruckown"
          header="Final Total to Truck Own"
        ></Column>
        <Column
          field="paymentrecvdate"
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

export default Ack;
