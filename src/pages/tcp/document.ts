import { messages } from "../../api/constants";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const getNestedValue = (obj: any, path: any) => {
    return path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
  };

export const downloadPDF = (data:any) => {
    const columns = [
      { field: "ats.date", header: "Date" },
      { field: "ats.transname", header: "Transport Name" },
      { field: "ats.trucknumber", header: "Truck Number" },
      { field: "ats.transcrossing", header: "Trans Crossing" },
      { field: "others", header: "Others" },
      { field: "remarks", header: "Remarks" },
      { field: "total", header: "Total" },
    ];
    const tableHeaders = columns.map((col) => ({
      text: col.header,
      style: "tableHeader",
      alignment: "center",
    }));
    const tableBody = [
      tableHeaders,
      ...data.map((row: any) =>
        columns.map((col) => ({
          text: getNestedValue(row, col.field),
          alignment: "center",
        }))
      ),
    ];
    const docDefinition: any = {
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
            widths: ["auto", "auto", "*", "auto", "auto", "*", '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 2],
        },
        subheader: {
          fontSize: 12,
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "black",
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };