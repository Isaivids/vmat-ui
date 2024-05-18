import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react'
import dummyData from '../../assets/dummydata.json'
import { Button } from 'primereact/button';
const AdvVmat = () => {
    const initialData: any = dummyData;
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
  
  return (
    <div className="p-2" style={{ overflowX: "auto" }}>
    <DataTable value={data} showGridlines scrollable scrollHeight="80vh">
      <Column field="sno" header="S.No"></Column>
      <Column field="date" header="Date"></Column>
      <Column field="truckname" header="Truck Name"></Column>
      <Column field="truckno" header="Truck No"></Column>
      <Column field="advamount" header="Adv. Amt"></Column>
      <Column field="penlaburwages" header="Pen. Labour Wages" body={renderInput}></Column>
      <Column field="extlaburwages" header="Ext. Labour Wages" body={renderInput}></Column>
      <Column field="others" header="Others" body={renderInput}></Column>
      <Column field="vmatcommission" header="VMAT Commision"></Column>
      <Column field="total" header="Total"></Column>
      <Column field="remarks" header="Remarks" body={renderInput}></Column>
      <Column
        header="Actions"
        body={renderButton}
        style={{ width: "200px", right: "0", position: "sticky" }}
      ></Column>
    </DataTable>
  </div>
  )
}

export default AdvVmat