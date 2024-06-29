import { Dialog } from "primereact/dialog";
import React from "react";

const modeOfAdvanceArr = [
  { name: "By VMAT", code: 1 },
  { name: "By Transport", code: 2 },
  { name: "By ToPay", code: 3 },
];
const transportAdvanceTypes = [
  { name: "To VMAT", code: 1 },
  { name: "To Truck", code: 2 },
];

const DialogAmt = ({ visible, setVisible, selectedData }: any) => {
  // selectedData = getOrderedData(selectedData)
  const renderValue = (key: any, value: any) => {
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
    if (key === "transaddvtype") {
      const mode = transportAdvanceTypes.find((mode) => mode.code === value);
      return mode ? mode.name : "";
    }
    return value ? value.toString() : '';
  };

  const renderPairs = (data: any) => {
    return (
      <div className="flex justify-content-between flex-wrap">
        <div className="col-6 uppercase">
          S.No<b> - {renderValue("sno", selectedData.sno)}</b>
        </div>
        <div className="col-6 uppercase">
          Transport name{" "}
          <b> - {renderValue("transname", selectedData.transname)}</b>
        </div>
        <div className="col-6 uppercase">
          Date <b> - {renderValue("date", selectedData.date)}</b>
        </div>
        <div className="col-6 uppercase">
          Transport freight{" "}
          <b> - {renderValue("transf", selectedData.transf)}</b>
        </div>
        <div className="col-6 uppercase">
          Truck Name{" "}
          <b> - {renderValue("truckname", selectedData.truckname)}</b>
        </div>
        <div className="col-6 uppercase">
          Transport advance{" "}
          <b> - {renderValue("transadv", selectedData.transadv)}</b>
        </div>
        <div className="col-6 uppercase">
          Truck Number{" "}
          <b> - {renderValue("trucknumber", selectedData.trucknumber)}</b>
        </div>
        <div className="col-6 uppercase">
          Transport balance{" "}
          <b> - {renderValue("transbln", selectedData.transbln)}</b>
        </div>
        <div className="col-6 uppercase">
          From <b> - {renderValue("from", selectedData.from)}</b>
        </div>
        <div className="col-6 uppercase">
          To Pay <b> - {renderValue("twopay", selectedData.twopay)}</b>
        </div>
        <div className="col-6 uppercase">
          To <b> - {renderValue("to", selectedData.to)}</b>
        </div>
        <div className="col-6 uppercase">
          Transport advance type{" "}
          <b> - {renderValue("transaddvtype", selectedData.transaddvtype)}</b>
        </div>
        <div className="col-6 uppercase">
          truck Freight <b> - {renderValue("truckf", selectedData.truckf)}</b>
        </div>
        <div className="col-6 uppercase">
          Delivery Date{" "}
          <b> - {renderValue("deliverydate", selectedData.deliverydate)}</b>
        </div>
        <div className="col-6 uppercase">
          truck Advance{" "}
          <b> - {renderValue("truckadv", selectedData.truckadv)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Truck Balance{" "}
          <b> - {renderValue("truckbln", selectedData.truckbln)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Truck Balance Type{" "}
          <b>
            {" "}
            - {renderValue("truckbalancetype", selectedData.truckbalancetype)}
          </b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Halting <b> - {renderValue("halting", selectedData.halting)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          late Day <b> - {renderValue("lateday", selectedData.lateday)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Mode of Advance{" "}
          <b> - {renderValue("modeofadvance", selectedData.modeofadvance)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Loading Wages{" "}
          <b> - {renderValue("loadingwages", selectedData.loadingwages)}</b>
        </div>
        <div className="col-6 uppercase"></div>
        <div className="col-6 uppercase">
          Truck Load Weight{" "}
          <b> - {renderValue("truckloadwt", selectedData.truckloadwt)}</b>
        </div>
        <div className="col-6 uppercase">
          VMAT Freight <b> - {renderValue("vmatf", selectedData.vmatf)}</b>
        </div>
      </div>
    );
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
