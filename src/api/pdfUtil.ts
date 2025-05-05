import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate, messages } from './constants';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (dataArray: any[], billArray: any[]) => {
  dataArray.forEach((data, index) => {
    const bill = billArray[index]; // matching the correct bill

    const docDefinition: any = {
      pageSize: 'A4',
      content: [
        {
          columns: [
            {
              text: 'T.PRAVEEN',
              style: 'header',
              alignment: 'left'
            },
            {
              text: 'Phone\nOwner: 94421-20580\n9087905456\nStaff: 8089056888',
              alignment: 'right'
            }
          ]
        },
        {
          image: messages.logoBase64,
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'VMAT TRANSPORT',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Lorry Suppliers for All Over India',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: '10/B, Highway City, Palathurai Main Road, Madukkarai,\n Coimbatore-641 105.',
          alignment: 'center',
        },
        {
          columns: [
            { text: `Bill Number: ${bill.billnumber}`, style: 'title2', alignment: 'left' },
            { text: `Date: ${formatDate(data.date)}`, alignment: 'right' }
          ],
          margin: [0, 20, 0, 30]
        },
        {
          columns: [
            {
              width: 'auto',
              stack: [
                { text: 'TRUCK NO', bold: true, margin: [0, 0, 100, 20] },
                { text: 'FROM', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TO', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TRANSPORT NAME', bold: true, margin: [0, 0, 100, 20] },
                { text: 'NO. OF TONS', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TRANSPORT FREIGHT', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TRANSPORT ADVANCE', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TRANSPORT BALANCE', bold: true, margin: [0, 0, 100, 20] },
                { text: 'TRANSPORT TOPAY', bold: true, margin: [0, 0, 100, 20] },
                { text: 'ACCOUNT NUMBER', bold: true, margin: [0, 0, 100, 20] }
              ]
            },
            {
              stack: [
                { text: `:  ${data?.trucknumber}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.from}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.to}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.transname}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.truckloadwt}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.transf}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.transadv}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.transbln}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.twopay}`, bold: true, margin: [0, 0, 0, 20] },
                { text: `:  ${data?.accountnumber || ''}`, bold: true, margin: [0, 0, 0, 20] },
              ],
            }
          ]
        },
        {
          image: messages.signature,
          alignment: 'right',
        },
        {
          text: 'For VMAT Transport',
          alignment: 'right',
          margin: [0, 0, 0, 0]
        },
        {
          text: 'Signature',
          alignment: 'right'
        }
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        title: {
          fontSize: 18,
          bold: true,
          color: 'red'
        },
        title2: {
          bold: true,
          color: 'red'
        },
        subheader: {
          fontSize: 12,
          italics: true
        },
      }
    };

    const serialNumber = data.sno || data.serialnumber || `Bill-${bill.billnumber}`;
    pdfMake.createPdf(docDefinition).download(`${serialNumber}.pdf`);
  });
};
