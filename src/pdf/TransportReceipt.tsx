import React, { useRef } from "react";
import "./TransportReceipt.scss";
import { formatDate, messages } from "../api/constants";
import { Button } from "primereact/button";
import ReactToPrint from "react-to-print";
import { InputText } from "primereact/inputtext";

const TransportReceipt = ({ data }: any) => {
  const componentRef: any = useRef();
  // Function to handle printing success
  const handlePrintSuccess = () => {
    console.log("Print successful!");
    // Add any actions you want to perform after successful printing
  };

  const calculateCommission = (row:any) =>{
    if([null,undefined,'null','undefined',''].includes(row.truckf)){
      return;
    }
    return 0.05 * Number(row.truckf)
  }

  const calculateCommission2 = (row:any) =>{
    if([null,undefined,'null','undefined',''].includes(row.truckf)){
      return;
    }
    return 0.02 * Number(row.truckf)
  }

  return (
    <div className="row">
      <ReactToPrint
        trigger={() => <Button label="Print" className="mb-2 m-3" />}
        content={() => componentRef.current}
        onBeforeGetContent={() => {
          console.log("Preparing content for printing...");
        }}
        onAfterPrint={handlePrintSuccess}
        onBeforePrint={() => {
          console.log("Printing...");
        }}
        onPrintError={(error) => {
          console.error("Print error:", error);
        }}
      />
      <div
        ref={componentRef}
        id="printable"
        className="container flex flex-column justify-content-between mx-3"
        style={{ height: "100vh" }}
      >
        <div className="header mx-2">
          <div className="leftHeader">
            <p className="bold">T.PRAVEEN</p>
          </div>
          <div className="companyInfo flex flex-column">
            <img src={messages.logoBase64} alt="VMAT Logo" className="logo" />
            <div>
              <h1 className="companyName text-red-600">VMAT TRANSPORT</h1>
              <p className="italic">Lorry Suppliers for All Over India</p>
              <p className="font-semibold	text-center">
                10/B, Highway City, Palathurai Main Road, Madukkarai,
                <br /> Coimbatore-641 105.
              </p>
            </div>
          </div>
          <div className="rightHeader">
            <p><i className="pi pi-phone text-xs mx-2"></i>Phone</p>
            <p className="bold">
              Owner: 94421-20580
              <br />
              9097905456
            </p>
            <p className="bold">Staff: 8089056888</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th colSpan={2}>Sl.No : {data.sno}</th>
              <th colSpan={2} className="text-right">
                Date : {formatDate(data.date)}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lorry Name</td>
              <td>
                {data.truckname}
              </td>
              <td>Lorry Number</td>
              <td>{data.trucknumber}</td>
            </tr>
            <tr>
              <td>From</td>
              <td>{data.from}</td>
              <td>To</td>
              <td>{data.to}</td>
            </tr>
            <tr>
              <td>Transport</td>
              <td>{data.transname}</td>
              <td>quantity</td>
              <td>{data.truckloadwt}Tons</td>
            </tr>
            <tr style={{borderBottom : '3px solid'}}>
              <td>Owner Name</td>
              <td><InputText /></td>
              <td>Driver Name/ Dc.No</td>
              <td><InputText /></td>
            </tr>
            <tr>
              <td>Truck Freight</td>
              <td>{data.truckf}</td>
              <td>Driver Commission</td>
              <td>{calculateCommission(data)}</td>
            </tr>
            <tr>
              <td>Truck Advance Amount</td>
              <td>{data.truckadv}</td>
              <td>Loading Mamol</td>
              <td><InputText keyfilter={"num"}/></td>
            </tr>
            <tr>
              <td>Truck Balance/ To Pay</td>
              <td>{data.truckbln}</td>
              <td>Guide Mamol</td>
              <td><InputText keyfilter={"num"}/></td>
            </tr>
            <tr>
              <td className="text-right" colSpan={4}>
                Total : 
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-column">
          <div className="flex justify-content-between mx-2 mb-3">
            <div className="sign align-content-end	">
              <span className="font-bold">Driver Signature</span>
            </div>
            <div className="sign align-content-end	">
              <span className="font-bold text-red-600">Commission Rupees : {calculateCommission2(data)}</span>
            </div>
            <div className="sign flex flex-column justify-content-between">
              <span className="font-bold text-red-600">For</span>
              <img src={messages.signature} alt="VMAT Logo" className="logo" />
              <span className="font-bold text-red-600">VMAT Transport</span>
            </div>
          </div>
          <div className="note p-2">
            Note: The Goods which are being loaded has to be delivered in same
            condition, if there is any damage, leakage & Shortage of goods the
            whole responsibility is to be taken only by Lorry driver & owner.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportReceipt;
