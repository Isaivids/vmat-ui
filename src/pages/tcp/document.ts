import { formatDate, messages } from "../../api/constants";
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
      return formatDate(obj.paymentreceiveddate);
    }
    if (obj.ats.date) {
      return formatDate(obj.ats.date);
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
        text: getNestedValue(row, col.field) ?? '',
        alignment: "center",
      }))
    ),
  ];

  // Calculate totals for the specified columns with error handling
  const totals: { [key: string]: number } = {};
  let totalColumns:any = []
  if(type === 6){
    totalColumns = ['total']
  }else if(type === 4){
    totalColumns = ['finaltotaltotruckowner']
  } else if(type === 1){
    totalColumns = ['total']
  } else if(type === 2){
    totalColumns = ['transadvtotruck']
  } else if(type === 3){
    totalColumns = ['total']
  } else if(type === 5){
    totalColumns = ['pending']
  } else if(type === 7){
    totalColumns = ['tyrasporterpaidamt']
  } 
  totalColumns.forEach((column:any) => {
    try {
      totals[column] = calculateColumnTotal(data, column);
    } catch (error) {
      console.error(`Error calculating total for column ${column}`, error);
      totals[column] = 0;
    }
  });

  // Create the grand total section as a separate content block
  const grandTotalContent = {
    text: 'Grand Total :' + totalColumns.map((column:any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const columnName = columns.find((col: any) => col.field === column)?.header || column;
      return `₹ ${totals[column].toFixed(2)}`;
    }).join('\n'),
    style: 'grandTotal',
    alignment: 'right',
    margin: [0, 10, 0, 0],
  };

  const docDefinition: any = {
    pageSize: (tableHeaders.length < 14 || type === 6) ? 'A4' : 'A3',
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
        table: {
          headerRows: 1,
          widths: columns.map(() => [5,6,8].includes(type) ? '*' : 'auto'),
          body: tableBody,
          style: "details",
        },
      },

      [8].includes(type) ? '' : grandTotalContent,
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
        fontSize: 20,
        bold: true,
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};
