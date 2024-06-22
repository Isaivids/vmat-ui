import { messages, totalColumns } from "../../api/constants";
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
    if (obj.paymentreceiveddate) {
      return new Date(obj.paymentreceiveddate).toLocaleDateString();
    }
    if (obj.ats.date) {
      return new Date(obj.ats.date).toLocaleDateString();
    }
    return '';
  }
  return path
    .split(".")
    .reduce((acc: any, part: any) => acc && acc[part], obj);
};

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

export const downloadPDF = (data: any, columns: any, searchQuery: any, type: number) => {
  const tableHeaders = columns.map((col: any) => ({
    text: col.header,
    style: "tableHeader",
    alignment: "center",
  }));
  
  const tableBody = [
    tableHeaders,
    ...data.map((row: any) =>
      columns.map((col: any) => ({
        text: getNestedValue(row, col.field),
        alignment: "center",
      }))
    ),
  ];

  // Identify the amount column and calculate the total for it
  const amountColumn = columns.find((col: any) => totalColumns.includes(col.field));
  const totalAmount = amountColumn ? calculateColumnTotal(data, amountColumn.field) : 0;

  // Create a total row with the total amount
  const totalRow = columns.map((col: any) => {
    if (totalColumns.includes(col.field)) {
      return { text: totalAmount.toString(), alignment: "center", bold: true };
    }
    return { text: "", alignment: "center", bold: true,fillColor: '#c4c4c4' };
  });

  tableBody.push(totalRow);

  const docDefinition: any = {
    pageSize: tableHeaders.length < 14 ? 'A4' : 'A3',
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
        text: "10/B, Highway City, Palathurai Main Rd, Madukkarai",
        style: "subheader",
        alignment: "center",
      },
      {
        text: getNameByType(type),
        style: "subheader",
        alignment: "center",
      },
      {
        text: getSearch(searchQuery),
        style: "subheader",
        alignment: "center",
      },
      {
        table: {
          headerRows: 1,
          widths: columns.map(() => 'auto'),
          body: tableBody,
          style: "details",
        },
      },
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
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "white",
        fillColor: '#202932',
      },
      details: {
        fontSize: 8
      }
    },
  };

  pdfMake.createPdf(docDefinition).open();
};
