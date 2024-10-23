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
    { name: "By VMAT / To Pay", code: 5 },
    { name: "By Transport / Balance", code: 2 },
    { name: "By Transporter / To pay", code: 3 },
    { name: "By To pay", code: 4 },
  ],
  transportAdvanceTypes: [
    { name: "To VMAT", code: 1 },
    { name: "To Truck", code: 2 },
    { name: "To pay", code: 3 },
    { name: "Nil", code: 4 },
  ],
  signature : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAjCAYAAAA33kzeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOrSURBVHgB5Vr/VdswEP7g8X+zAdqg6QRVN2AD3A2yAe4EpBPgTlA6QdwJkk6ANwidAPyhuyfFWHLshASH7717xjr9us+nk07hDP0wqeWqlmktl/JOPNbyr5ZVLaW8fyiQiKKWJ5E1PBmUKtBRFrVk8ASeNOgtD3Ck5LWYRF1bywyOvCdpd4MTxjUcMTTUoB9IbAFPlMGJgbGGxi3RvlRsLXPRr4O6d6IL6z2I/honAgPvOW3kcNloLLqHIyqXv5WMm0Z/Sym3GDkMnJGxZcEyGvob8SA8lzqhnn8vESd9NCjgjDMD9YAnMWuUWynPMVJk6DZAvcAk6ljElxPbLzBS6NJKQc86WUQ/7einQPcY7xIZnOFXiToTeIJMQ8f3At3bOr2nxAhBo8qOOgaOgDt5J2E8GC7gd7Uc8SDcbD8aZNhuC9Z63MFIip5/KqSJUdyiO8C/S9DYrrhg4c84Ssoc259rMox0BzNwE59H9Bp0w2R0jn4w8AfPUeEcjgDiPlJH48UvefIq4xO2h4HzULb7hpHhAn6JlJE6NIwkMr78lXqf4ZZKBbdzxWDh4pWSU+EwmMkzvJeqEvWpm8DHUD5pI++4XjxnmWgc3gVl8EmsbuexNrc4TiYfzm9XKelBXC7/EwOGX6GUZwVndCkTquA9zcJl7STpJ5ynHfKGsZTxVrV8D8pNoo2RNjpPtYV9vMSHlAcR9IL7RocF/DYfylp0Fruhzw7ZxAztp32DeAYQRQFnVAy2ZbApfHCn/kr0Gqu6MO3QZxi2W4bI8dprlLiu8VsnYyP6ApsEGvjYEiNjirhL6yRjCauBP1ak0p4hmCKdR7aCRpKA2ITD5aV3Orq0qLONvjQ4a0oxkwnNg3YrvL5UIww2z1wG+0WGgZd2+lVpkAnKrZTPRHTyGTZP1jQ8JI5kFNg0lroSfnIFvCflMvYa/mOtsX9skzFEkcMbsww629j28Hr9ZnDG6tWrbejpVQbtYFv1prW0N3ibjN9g97j20gk9hcaW8OlBjsPeJStZfZAhHVuo6x2gU9C7nxyHhY4769HGwHthDPqDQi+cJ3TK9CVc4D0UdNxVjzaPcIfSL4k6X7HnZWuxuRu9BRbwu2EoYRxUif0+tw0sBh4bLhI6fsE/8twpsEVg4CZO1w9TnUvRnYkomDgOTVnUKyuMDG3nLz1yDPWWNuTSZ2+c47j4Af8PD4dAb9IvcFzouccEZbqMJtjfLUAhY+yzz6PBoP82/+GQ4Z388vEM4q5SldB82G4AAAAASUVORK5CYII=',
  logoBase64: "data:image/png;base64,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",
  gpay : "data:image/png;base64,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",
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
       name: "Transport Advance to Truck",
      to: "/transportadvance",
       image: require("../assets/ico5.svg").default,
       color: "yellowMenu"
     },
    // {
    //   name: "Transporter Advance To Truck",
    //   to: "/topay",
    //   image: require("../assets/ico5.svg").default,
    //   color: "whitemenu"
    // },
    {
      name: "Acknowledgement",
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
    {
      name: "Bank Details",
      to: "/bankdetails",
      image: require("../assets/ico3.svg").default,
      color: "whitemenu"
    },
    {
      name: "Courier Details",
      to: "/courierdetails",
      image: require("../assets/ico3.svg").default,
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
  if (!date) return "";
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const dateSort = (data:any[]) =>{
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  return sortedData;
}


export const getTotalCrossing = (data: any) => {
  return (Number(data.crossing) || 0) + (Number(data.vmatcrossing) || 0)
}

export const getTCPDoc = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "transcrossing", header: "Trans Crossing" },
    { field: "others", header: "Others" },
    { field: "remarks", header: "Remarks" },
    { field: "total", header: "Total" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}
export const tcpWidths = [70,'*',100,100,100,100,100,100]

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

export const getTruckAdvanceDetails = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.from", header: "From" },
    { field: "ats.to", header: "To" },
    { field: "ats.transadv", header: "Transport Advance" },
    { field: "tdstta", header: "TDS Deduction 1%" },
    { field: "extraloadingwagespaidbydriver", header: "Extra Loading  Paid by Driver" },
    { field: "transporterpaidadvanceamount", header: "Transporter Paid Advance Amount" },
  ];
}

export const truckAdvanceWidths = [70,'*',70,70,70,70,70,70,70,70]

export const truckWidths = [500,'*']

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
    // { field: "rtgsnumber", header: "RTGS Number" },
  ];
};

export const ccptoWidths = [70,'*',100,100,100,100,100,100]

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

export const twopayWidths = [70,'*',50,50,50,50,50,50,50,50,50,50]

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
export const vmatWidths = [70,'*',50,50,50,50,50,50,50,50,50,50,50]


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
export const transWidths = [70,'*',70,70,70,70,70,70,70,50,50,50,50]

export const getTBP = () => {
  return [
    { field: "ats.date", header: "Date" },
    // { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transbln", header: "Transport balance" },
    { field: "loadingwagespending", header: "Loading Wages Pending" },
    { field: "extraloadingwagespaidbydriver", header: "Extra loading wages paid by driver" },
    { field: "loadunloadchar", header: "Unloading Wages" },
    { field: "plusorminus", header: "Unloading Charge" },
    { field: "tyrasporterpaidamt", header: "Transporter to be Paid" },
    { field: "trpaidtotruck", header: "Transporter Paid To VMAT" },
    { field: "diffto", header: "Difference Amount to Transporter" },
    { field: "difffrom", header: "Difference Amount from Transporter" },
    { field : "tdstbp" , header : "TDS Deduction 1%"},
    { field: "remarks", header: "Remarks" },
    { field: "paymentreceiveddate", header: "Payment Received Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}
export const tbpWidths = [70,'*',50,50,50,50,50,50,70,70,70,50,50,50,70,50]

export const getTBP2 = () => {
  return [
    { field: "ats.date", header: "Date" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transbln", header: "Transport balance" },
    { field : "tdstbp" , header : "TDS Deduction 1%"},
    { field : "others" , header : "Others"},
    { field: "loadingwagespending", header: "Loading Wages Pending" },
    { field: "extraloadingwagespaidbydriver", header: "Extra loading wages paid by driver" },
    { field: "loadunloadchar", header: "Unloading Wages" },
    { field: "plusorminus", header: "Unloading Charge" },
    { field: "tyrasporterpaidamt", header: "Transporter to be Paid" },
    { field: "trpaidtotruck", header: "Transporter Paid To Truck" },
    { field: "diffto", header: "Difference Amount to Transporter" },
    { field: "difffrom", header: "Difference Amount from Transporter" },
    { field: "remarks", header: "Remarks" },
    { field: "paymentreceiveddate", header: "Payment Received Date" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}
export const tbpWidths2 = [70,'*',50,50,50,50,50,40,40,50,60,70,50,50,40,60,40]

export const getACK = () => {
  return [
    { field: "ats.date", header: "Date" },
    // { field: "acknowledgementReceivedDate", header: "Ack.Rec Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.truckbln", header: "Truck Balance" },
    { field: "ats.lateday", header: "Late Delivery" },
    { field: "ats.halting", header: "Halting" },
    { field: "expense", header: "Unloading Wages" },
    { field: "podcharge", header: "POD Charge" },
    // { field: "vmatcrossing", header: "VMAT Crossing" },
    { field: "vmatcommision", header: "VMAT Commission" },
    // { field: "transcrossing", header: "Transport Crossing" },
    { field: "ats.twopay", header: "By To Pay Transport Balance." },
    { field: "tdsack", header: "Others" },
    { field: "finaltotaltotruckowner", header: "Final Payment to Truck Owner" },
    { field: "paymentReceivedDate", header: "Payment transfer to truck owner" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}

export const ackWidths = [80,'*',80,80,80,50,50,50,50,50,50,50,80,80,80,80]


export const getACK2 = () => {
  return [
    { field: "ats.date", header: "Date" },
    // { field: "acknowledgementReceivedDate", header: "Ack.Rec Date" },
    { field: "ats.truckname", header: "Truck Name" },
    { field: "ats.trucknumber", header: "Truck Number" },
    { field: "ats.transname", header: "Transport Name" },
    { field: "ats.truckbln", header: "Truck Balance" },
    { field: "ats.lateday", header: "Late Delivery" },
    { field: "ats.halting", header: "Halting" },
    { field: "expense", header: "Unloading Wages" },
    { field: "podcharge", header: "POD Charge" },
    { field: "vmatcommision", header: "VMAT Commission" },
    { field: "ats.twopay", header: "By To Pay Transport Balance." },
    { field: "tdsack", header: "Others" },
    { field: "finaltotaltotruckowner", header: "Final Payment to Truck Owner" },
    { field: "trpaidtotruck", header: "Transporter Paid To Truck" },
    { field: "diffto", header: "Difference Amount from truck owner to VMAT" },
    { field: "difffrom", header: "Difference Amount from Truck Owner" },
    { field: "paymentReceivedDate", header: "Payment transfer to truck owner" },
    { field: "modeofpayment", header: "Mode Of Payment" },
    { field: "rtgsnumber", header: "RTGS Number" },
  ];
}

export const ackWidths2 = [70,'*',70,70,50,40,40,50,50,50,50,50,50,50,50,70,70,70,70]


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

export const initialrows = 50;
export const paginationRows = [50,100,200,300,400,500];

export const totalColumns = ['total','transadvtotruck','advanceamount','finaltotaltotruckowner','pending','tyrasporterpaidamt']
