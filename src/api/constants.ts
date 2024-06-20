export const messages = {
  success: "Success",
  error: "Error",
  updateoraddfailure: "Unable to add/update data. Please try again",
  updateoraddsuccess: "Data added/updated successfully",
  validationerror: "Validation Error",
  loadfailure: "Unable to load data please try again",
  modeofpayments: [
    { name: "Cash", code: "CASH" },
    { name: "IMPS", code: "IMPS" },
    { name: "G-Pay", code: "GPAY" },
    // { name: "Phone Pay", code: "PHONEPAY" },
    { name: "RC Owner Account", code: "RCOWNER" },
    { name: "VMAT account", code: "VMATACCOUNT" },
    { name: "Pending", code: "PENDING" }
  ],
  modeofbalance: [
    { name: "Balance", code: "BALANCE" },
    { name: "To Pay", code: "TOPAY" }
  ],
  podCharge: [
    { name: 0, code: 0 },
    { name: 100, code: 100 },
    { name: 200, code: 200 },
    { name: 300, code: 300 },
    { name: 400, code: 400 },
    { name: 500, code: 500 },
    { name: 600, code: 600 },
    { name: 700, code: 700 },
    { name: 800, code: 800 },
    { name: 900, code: 900 },
    { name: 1000, code: 1000 },
  ],
  modeOfAdvance: [
    { name: "By VMAT", code: 1 },
    { name: "By Transport", code: 2 },
    { name: "By Advance / To pay", code: 3 },
    { name: "By To pay", code: 4 },
  ],
  transportAdvanceTypes: [
    { name: "To VMAT", code: 1 },
    { name: "To Truck", code: 2 },
    { name: "To pay", code: 3 },
    { name: "Nil", code: 4 },
  ],
  logoBase64: "data:image/png;base64,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",
  menuList: [
    {
      name: "Daily Report & Truck detail",
      to: "/amt",
      image: require("../assets/ico1.svg").default,
      color: "whitemenu"
    },
    {
      name: "Truck Advance",
      to: "/advance",
      image: require("../assets/ico3.svg").default,
      color: "whitemenu"
    },
    {
      name: "Transport Advance",
      to: "/transportadvance",
      image: require("../assets/ico5.svg").default,
      color: "yellowMenu"
    },
    {
      name: "By To Pay Advance",
      to: "/topay",
      image: require("../assets/ico5.svg").default,
      color: "whitemenu"
    },
    {
      name: "Acknowledgement / POD",
      to: "/ack",
      image: require("../assets/ico2.svg").default,
      color: "whitemenu"
    },
    {
      name: "Commission Crossing Pending",
      to: "/ccpto",
      image: require("../assets/ico4.svg").default,
      color: "whitemenu"
    },
    {
      name: "Transport Crossing Payment",
      to: "/tcp",
      image: require("../assets/ico5.svg").default,
      color: "yellowMenu"
    },
    {
      name: "Transport Balance payment",
      to: "/payment",
      image: require("../assets/ico4.svg").default,
      color: "yellowMenu"
    },
    {
      name: "Transport Details",
      to: "/transport",
      image: require("../assets/ico5.svg").default,
      color: "yellowMenu"
    },
    {
      name: "Truck Details",
      to: "/truck",
      image: require("../assets/ico5.svg").default,
      color: "whitemenu"
    },
  ],
  menuListVmat: {
    name: "VMAT Account",
    to: "/vmataccount",
    image: require("../assets/ico5.svg").default,
    color: "redMenu"
  }
}

export const formatDate = (date: any) => {
  return date ? new Date(date).toLocaleDateString() : "";
};

export const getTotalCrossing = (data: any) => {
  return (Number(data.crossing) || 0) + (Number(data.vmatcrossing) || 0)
}

export const getTCPDoc = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transcrossing", header: "Trans Crossing" },
    { field: "others", header: "Others" },
    { field: "remarks", header: "Remarks" },
    { field: "total", header: "Total" },
  ];
}

export const getTruckDetails = () => {
  return [
    // { field: "truckname", header: "Truck Name" },
    // { field: "address", header: "Address" },
    // { field: "phonenumber", header: "Phone Number" },
    { field: "accountnumber", header: "Account Number" },
    { field: "pannumber", header: "PAN Number" },
    // { field: "loadingaddress", header: "Loading Address" },
    // { field: "unloadingaddress", header: "Unloading Address" },
    // { field: "location", header: "Location" },
  ];
}

export const getCCPTODetails = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.truckname", header: "Truck name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "vmatcommision", header: "VMAT Commission" },
    { field: "totalcrossing", header: "Total Crossing" },
    { field: "ack.expense", header: "Expense" },
    { field: "pending", header: "Pending" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
};

export const getTwoPayDetails = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.transf", header: "Transport Freight" },
    { field: "ats.transaddvtype", header: "Transporter advance type to Truck" },
    { field: "advanceamount", header: "Transport Advance" },
    { field: "luxwages", header: "Loading/Unloading Extra Wages" },
    { field: "total", header: "Advance Amount Paid to Truck" },
    { field: "paymentreceiveddate", header: "Payment Received Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
};

export const getVMAT = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "advanceamount", header: "Advance" },
    { field: "vmatcommision", header: "VMAT Commision" },
    { field: "pendinglabourwages", header: "Loading Wages Pending" },
    { field: "extlabourwages", header: "Extra loading wages paid by driver" },
    { field: "others", header: "Others" },
    { field: "othersreason", header: "Reason" },
    { field: "total", header: "Advance Payment Paid to truck" },
    { field: "paymentreceiveddate", header: "Payment RTGS Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}

export const getTransADV = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.transf", header: "Transport Freight" },
    { field: "advanceamount", header: "Transport Advance" },
    { field: "wages", header: "Loading wages" },
    { field: "others", header: "Others" },
    { field: "transadvtotruck", header: "Transport Advance to Truck" },
    { field: "remarks", header: "Remarks" },
    { field: "paymentreceiveddate", header: "Payment Received Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}
export const getTBP = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transbln", header: "Transport balance" },
    { field: "loadingwagespending", header: "Loading Wages Pending" },
    { field: "extraloadingwagespaidbydriver", header: "Extra loading wages paid by driver" },
    { field: "loadunloadchar", header: "Unloading Wages" },
    { field: "plusorminus", header: "Unloading Charge" },
    { field: "tyrasporterpaidamt", header: "Transporter to be Paid" },
    { field: "remarks", header: "Remarks" },
    { field: "paymentreceiveddate", header: "Payment Received Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}
export const getACK = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "acknowledgementReceivedDate", header: "Ack.Rec Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.truckbln", header: "Truck Balance" },
    { field: "ats.lateday", header: "Late Delivery" },
    { field: "ats.halting", header: "Halting" },
    { field: "expense", header: "Expense" },
    { field: "podcharge", header: "POD Charge" },
    { field: "vmatcrossing", header: "VMAT Crossing" },
    { field: "vmatcommision", header: "VMAT Commission" },
    { field: "transcrossing", header: "Transport Crossing" },
    { field: "ats.twopay", header: "By To Pay Transport Balance." },
    { field: "finaltotaltotruckowner", header: "Final Total to Truck Owner" },
    { field: "paymentReceivedDate", header: "Payment transfer to truck owner" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}

export const pageName = [
  { type: 1, name: 'Truck Advance By VMAT' },
  { type: 2, name: 'Truck Advance By Transporter' },
  { type: 3, name: 'By To Pay Advance' },
  { type: 4, name: 'Acknowledgement/POD' },
  { type: 5, name: 'Commission Crossing Pending' },
  { type: 6, name: 'Transport Crossing Payment' },
  { type: 7, name: 'Transport Balance Payment' },
  { type: 8, name: 'Truck Details' },
]