import { ackWidths, ackWidths2, ccptoWidths, formatDate, messages, tbpWidths, tbpWidths2, tcpWidths, transWidths, truckAdvanceWidths, truckWidths, twopayWidths, vmatWidths } from "../../api/constants";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { pageName } from '../../api/constants';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getNestedValue = (obj: any, path: any) => {
  if (path.startsWith("ats.transaddvtype")) {
    const value = path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
    const type = messages.transportAdvanceTypes.find((type: any) => type.code === value);
    return type ? type.name : '';
  }
  if (path.startsWith("paymentreceiveddate") || path.startsWith("ats.date")) {
    if (path.startsWith("paymentreceiveddate") && obj.paymentreceiveddate) {
      return formatDate(obj.paymentreceiveddate);
    }
    if (path.startsWith("ats.date") && obj.ats.date) {
      return formatDate(obj.ats.date);
    }
    return '';
  }
  return path
    .split(".")
    .reduce((acc: any, part: any) => acc && acc[part], obj);
};

const getWidths = (type: any) => {
  let returnValue: any;
  switch (type) {
    case 1:
      returnValue = vmatWidths
      break;
    case 2:
      returnValue = transWidths
      break;
    case 3:
      returnValue = twopayWidths
      break;
    case 4:
      returnValue = ackWidths
      break;
    case 5:
      returnValue = ccptoWidths
      break;
    case 6:
      returnValue = tcpWidths
      break;
    case 7:
      returnValue = tbpWidths
      break;
    case 8:
      returnValue = truckWidths
      break;
    case 9:
      returnValue = truckAdvanceWidths;
      break;
    case 10:
      returnValue = tbpWidths2;
      break;
    case 11:
      returnValue = ackWidths2;
      break;
    default:
      break;
  }
  return returnValue;
}

const getSearch = (searchQuery: any) => {
  let returnValue = '';
  if (searchQuery.query) {
    returnValue = returnValue + searchQuery.query;
  }
  if (searchQuery.fromDate) {
    returnValue = ' ' + returnValue + 'From ' + searchQuery.fromDate + ' ';
  }
  if (searchQuery.toDate) {
    returnValue = ' ' + returnValue + 'To ' + searchQuery.toDate;
  }
  return returnValue;
};

const getNameByType = (type: number) => {
  const page = pageName.find(page => page.type === type);
  return page ? page.name : null;
};

const calculateColumnTotal = (data: any, columnField: any) => {
  return data.reduce((total: number, row: any) => {
    const value = getNestedValue(row, columnField);
    return total + (isNaN(value) ? 0 : parseFloat(value));
  }, 0);
};

export const downloadPDF = (data: any, columns: any, searchQuery: any, type: number, ack?: any) => {
  const tableHeaders = columns.map((col: any) => ({
    text: col.header,
    style: "tableHeader",
    alignment: "center",
  }));

  const tableBody = [
    tableHeaders,
    ...data.map((row: any) =>
      columns.map((col: any) => ({
        text: getNestedValue(row, col.field) ?? '',
        alignment: "center",
      }))
    ),
  ];

  // Calculate totals for the specified columns with error handling
  const totals: { [key: string]: number } = {};
  let totalColumns: any = []
  if (type === 6) {
    totalColumns = ['total']
  } else if (type === 4) {
    totalColumns = ['finaltotaltotruckowner']
  } else if (type === 1) {
    totalColumns = ['total']
  } else if (type === 2) {
    totalColumns = ['transadvtotruck']
  } else if (type === 3) {
    totalColumns = ['total']
  } else if (type === 5) {
    totalColumns = ['pending']
  } else if (type === 7) {
    totalColumns = ['tyrasporterpaidamt']
  } else if (type === 9) {
    totalColumns = ['transporterpaidadvanceamount']
  }
  totalColumns.forEach((column: any) => {
    try {
      totals[column] = calculateColumnTotal(data, column);
    } catch (error) {
      console.error(`Error calculating total for column ${column}`, error);
      totals[column] = 0;
    }
  });


  const totalAmount = data.reduce((n: any, { finaltotaltotruckowner }: any) => n + Number(finaltotaltotruckowner), 0) || 0;

  if (ack && ack.length > 0) {
    ack = ack.filter(({ amount }: any) => amount !== '' && amount !== null && amount !== undefined);
    ack = [{
      remark: "Total", 
      amount: `${totalAmount}`
    }, ...ack];
  
    const otherAmountsSum = ack
      .filter(({ remark }: any) => remark !== "Total")
      .reduce((n: number, { amount }: any) => n + Number(amount), 0);
    const balance = (totalAmount - otherAmountsSum);
    ack = [...ack, {
      remark: "Balance",
      amount: `${balance}`
    }];
  }
  

  const grandTotalContent = {
    text: 'Total :' + totalColumns.map((column: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const columnName = columns.find((col: any) => col.field === column)?.header || column;
      const amount = totals[column]
      return ` ${amount} `;
    }).join('\n'),
    style: 'grandTotal',
    alignment: 'right',
    margin: [0, 10, 0, 0],
  };

  const ackContent = ack && ack?.length > 0 && ack.map(({ remark, amount }: any) => ({
    columns: [
      { width: "*", text: '' },
      {
        width: 'auto',
        margin: [0, 10, 100, 0],
        table: {
          widths: [100, 100],
          body: [
            [
              { text: remark, style: 'grandTotal' },
              { text: `₹ ${amount || 0}`, style: 'grandTotal', alignment: 'right' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    ],
  }));
  

  const docDefinition: any = {
    pageSize: (tableHeaders.length < 14) ? 'A4' : 'A3',
    pageOrientation: 'landscape',
    pageMargins: [10, 10, 10, 10],
    content: [
      { image: messages.logoBase64, width: 150, alignment: "center" },
      {
        text: "VMAT TRANSPORT",
        style: "header",
        alignment: "center",
      },
      {
        text: "10/B, Highway City, Palathurai Main Rd, Madukkarai, CBE",
        style: "subheader",
        alignment: "center",
      },
      {
        text: getNameByType(type),
        style: "subheader2",
        alignment: "center",
      },
      {
        text: getSearch(searchQuery),
        style: "subheader3",
        alignment: "center",
      },
      {
        text: `Total Sl. No : ${tableBody.length - 1}`,
        style: "subheader3",
      },
      {
        table: {
          headerRows: 1,
          // widths: [6].includes(type) ? tcpWidths : columns.map(() => [5,6,8].includes(type) ? '*' : 'auto'),
          widths: getWidths(type),
          body: tableBody,
          style: "details",
        },
        layout: {
          hLineWidth: function (i: number, node: any) { return (i === 0 || i === node.table.body.length) ? 1 : 0.5; },
          vLineWidth: function (i: number) { return 0.5; },
          hLineColor: function (i: number, node: any) { return (i === 0 || i === node.table.body.length) ? 'black' : 'gray'; },
          vLineColor: function (i: number) { return 'gray'; },
        },
      },
      (ack || ack?.length >0 || [8].includes(type)) ? ackContent : grandTotalContent,
      // ack && (ack[0].remark || ack[0].amount) ? { text: `${ack[0].remark} : ${ack[0].amount}`, alignment: 'right', style: 'header' } : "",
      // ack && (ack[1].remark || ack[1].amount) ? { text: `${ack[1].remark} : ${ack[1].amount}`, alignment: 'right', style: 'header' } : "",
      // ack && (ack[2].remark || ack[2].amount) ? { text: `${ack[2].remark} : ${ack[2].amount}`, alignment: 'right', style: 'header' } : "",
      // ack && ack.length > 0 && { text: `Balance : ${total - ack.reduce((n: any, { amount }: any) => n + Number(amount), 0)}`, alignment: 'right', style: 'grandTotal' },
      ...(type === 5 ? [{ image: messages.gpay, width: 150, alignment: "center" }] : []),
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true,
      },
      subheader: {
        fontSize: 10,
        bold: true,
      },
      subheader2: {
        fontSize: 18,
        bold: true,
        margin: [10, 10, 10, 10]
      },
      subheader3: {
        fontSize: 15,
        bold: true,
        margin: [5, 5, 5, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "white",
        fillColor: '#202932',
      },
      details: {
        fontSize: 8
      },
      grandTotal: {
        fontSize: 16,
        bold: true,
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};
