import { Dialog } from "primereact/dialog";
import React from "react";

const keyMapping: any = {
  sno: "SNO",
  date: "DATE",
  truckname: "TRUCK NAME",
  trucknumber: "TRUCK NUMBER",
  transname: "TRANSPORT NAME",
  from: "FROM",
  to: "TO",
  truckadv: "TRUCK ADVANCE",
  transaddvtype: "TRANSPORT ADVANCE TYPE",
  repdate: "REPORTING DATE",
  unloaddate: "UNLOAD DATE",
  lateday: "LATE DAY",
  halting: "HALTING",
  truckf: "TRUCK FREIGHT",
  transf: "TRANSPORT FREIGHT",
  vmatf: "VMAT FREIGHT",
  modeofadvance: "MODE OF ADVANCE",
  transadv: "TRANSPORT ADVANCE",
  vmatadv: "VMAT ADVANCE",
  truckbln: "TRUCK BALANCE",
  transbln: "TRANSPORT BALANCE",
  twopay: "TWO PAY BALANCE",
  truckloadwt: "TRUCK LOAD WEIGHT",
};

const modeOfAdvanceArr = [
  { name: "By VMAT", code: 1 },
  { name: "By Transport", code: 2 },
  { name: "By TwoPay", code: 3 },
];
const transportAdvanceTypes = [
  { name: "To VMAT", code: 1 },
  { name: "To Truck", code: 2 },
];

const DialogAmt = ({ visible, setVisible, selectedData }: any) => {
  const renderValue = (key:any,value: any) => {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    if (key === "modeofadvance") {
      const mode = modeOfAdvanceArr.find((mode) => mode.code === value);
      return mode ? mode.name : "";
    }
    if(key === "transaddvtype"){
      const mode = transportAdvanceTypes.find((mode) => mode.code === value);
      return mode ? mode.name : "";
    }
    return value.toString();
  };

  const renderPairs = (data: any) => {
    const keys = Object.keys(data).filter(
      (key) => key !== "_id" && key !== "created_at" && key !== "updated_at" && key !== "__v" && key !== "ackmodeofpayment"
    );
    const pairs = [];
    for (let i = 0; i < keys.length; i += 2) {
      const key1 = keys[i];
      const key2 = keys[i + 1];
      pairs.push(
        <div
          key={key1}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ width: "50%", textAlign: "left", textTransform : "uppercase" }}>
            <strong>{keyMapping[key1] || key1}:</strong> {renderValue(key1,data[key1])}
          </div>
          {key2 && (
            <div style={{ width: "50%", textAlign: "left", textTransform : "uppercase" }}>
              <strong>{keyMapping[key2] || key2}:</strong> {renderValue(key2,data[key2])}
            </div>
          )}
        </div>
      );
    }
    return pairs;
  };

  return (
    <Dialog
      header="Daily Report & Truck Detail"
      visible={visible}
      style={{ width: "70vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <div>{selectedData && renderPairs(selectedData)}</div>
    </Dialog>
  );
};

export default DialogAmt;
