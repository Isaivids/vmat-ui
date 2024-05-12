import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import dummyData from '../../assets/dummydata.json'
const Amt = () => {
  const initialData = dummyData;
  const [data, setData] = useState(initialData);
  const [selectedRowId, setSelectedRowId]:any = useState(null);

  const onInputChange = (e:any, id:any, field:any) => {
    const { value } = e.target;
    const newData = data.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData(newData);
  };

  const renderInput = (rowData:any, field:any) => {
    return (
      <InputText
        disabled={rowData.id !== selectedRowId}
        value={rowData[field.field] || ""}
        onChange={(e) => onInputChange(e, rowData.id, field.field)}
      />
    );
  };

  const renderButton = (rowData:any) => {
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

  const addNewRow = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const nextSno = data.reduce((maxSno, row) => {
      const sno = parseInt(row.sno);
      return sno > maxSno ? sno : maxSno;
    }, 0) + 1;
  
    const newRow = {
      id: data.length + 1,
      sno: nextSno.toString() + `/` + month,
      date: currentDate.toISOString().split("T")[0],
      truckname: "",
      truckno: "",
      transname: "",
      from: "",
      to: "",
      trcukad: "",
      repdate: "",
      unloaddate: "",
      lateday: "",
      halting: "",
      truckf: "",
      transf: "",
      vmatf: "",
      transad: "",
      trckbin: "",
      transbin: "",
      "2pay": "",
      truckload: "",
    };
    setData([...data, newRow]);
    setSelectedRowId(newRow.id)
  };
  

  return (
    <>
      <div className="p-2" style={{ overflowX: "auto" }}>
        <Button label="New" className="mb-2" severity="success" onClick={addNewRow} />
        <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
          <Column field="sno" header="S.No"></Column>
          <Column field="date" header="Date"></Column>
          <Column
            field="trcukname"
            header="Truck Name"
            body={renderInput}
          ></Column>
          <Column field="truckno" header="Truck No" body={renderInput}></Column>
          <Column
            field="transname"
            header="Trans Name"
            body={renderInput}
          ></Column>
          <Column field="from" header="From" body={renderInput}></Column>
          <Column field="to" header="To" body={renderInput}></Column>
          <Column field="trcukad" header="Truck Ad" body={renderInput}></Column>
          <Column
            field="repdate"
            header="Rep. Date"
            body={renderInput}
          ></Column>
          <Column
            field="unloaddate"
            header="Unload Date"
            body={renderInput}
          ></Column>
          <Column field="lateday" header="Late Day" body={renderInput}></Column>
          <Column field="halting" header="Halting" body={renderInput}></Column>
          <Column field="truckf" header="Truck F" body={renderInput}></Column>
          <Column field="transf" header="Trans F" body={renderInput}></Column>
          <Column field="vmatf" header="VMAT F" body={renderInput}></Column>
          <Column field="trcukad" header="Truck Ad" body={renderInput}></Column>
          <Column field="transad" header="Trans Ad" body={renderInput}></Column>
          <Column
            field="trckbin"
            header="Truck Bin"
            body={renderInput}
          ></Column>
          <Column
            field="transbin"
            header="Trans Bin"
            body={renderInput}
          ></Column>
          <Column field="2pay" header="2-Pay" body={renderInput}></Column>
          <Column
            field="truckload"
            header="Truck Load Wt"
            body={renderInput}
          ></Column>
          <Column
            header="Actions"
            body={renderButton}
            style={{ width: "200px", right: "0", position: "sticky" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default Amt;
