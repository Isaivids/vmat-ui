import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
const Transport = () => {
  const [data, setData] = useState([
    { name: "Dilan", address: "123", phone: "9876543210" },
    { name: "Dilan", address: "123", phone: "9876543210" },
    { name: "Dilan", address: "123", phone: "9876543210" },
    { name: "Dilan", address: "123", phone: "9876543210" },
    { name: "Dilan", address: "123", phone: "9876543210" },
  ]);
  return (
    <div className="p-2 w-screen">
      <DataTable value={data} showGridlines>
        <Column field="name" header="Transport Name"></Column>
        <Column field="address" header="Address"></Column>
        <Column field="phone" header="Phone Number"></Column>
      </DataTable>
    </div>
  );
};

export default Transport;
