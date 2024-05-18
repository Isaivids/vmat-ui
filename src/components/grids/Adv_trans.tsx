import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import dummyData from "../../assets/dummydata.json";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
const AdvTrans = () => {
  const initialData: any = dummyData;
  const modeOfPayments = [
    { name: "Cash", code: "CASH" },
    { name: "Internet", code: "INT" },
    { name: "UPI", code: "UPI" },
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(initialData);
  const [selectedRowId, setSelectedRowId]: any = useState(null);
  const renderInput = (rowData: any, field: any) => {
    return (
      <InputText
        disabled={rowData.id !== selectedRowId}
        value={rowData[field.field] || ""}
        // onChange={(e) => onInputChange(e, rowData.id, field.field)}
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

  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
      <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
        <Column field="sno" header="S.No"></Column>
        <Column field="date" header="Date"></Column>
        <Column field="truckname" header="Truck Name"></Column>
        <Column field="transname" header="Trans Name"></Column>
        <Column field="transfreight" header="Trans Freight"></Column>
        <Column field="transadv" header="Trans Adv"></Column>
        <Column field="transadvtotruck" header="Trans Adv to Truck"></Column>
        <Column field="wages" header="Wages" body={renderInput}></Column>
        <Column field="others" header="Others" body={renderInput}></Column>
        <Column field="remarks" header="Remarks" body={renderInput}></Column>
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

export default AdvTrans;
