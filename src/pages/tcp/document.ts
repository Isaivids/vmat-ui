import { messages } from "../../api/constants";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const getNestedValue = (obj: any, path: any) => {
  if (path.startsWith("ats.transaddvtype")) {
    const value = path
    .split(".")
    .reduce((acc: any, part: any) => acc && acc[part], obj);
    const type = messages.transportAdvanceTypes.find((type:any) => type.code === value);
    // return type ? type.name : undefined;
    return type ? type.name : ''
  }
  if(path.startsWith("paymentreceiveddate") || path.startsWith("ats.date")){
    if(obj.paymentreceiveddate){
      return new Date(obj.paymentreceiveddate).toLocaleDateString();
    }
    if(obj.ats.date){
      return new Date(obj.ats.date).toLocaleDateString();
    }
    return ''
  }
  return path
    .split(".")
    .reduce((acc: any, part: any) => acc && acc[part], obj);
};

export const downloadPDF = (data: any, columns: any) => {
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
        table: {
          headerRows: 1,
          widths: columns.map(() => 'auto'),
          // widths: ["auto", "auto", "*", "auto", "auto", "*", '*'],
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
        color: "black",
      },
      details : {
        fontSize : 8
      }
    },
  };

  pdfMake.createPdf(docDefinition).open();
};