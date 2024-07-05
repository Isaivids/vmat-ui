// pdfUtil.js
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePdfFromHtml = (htmlId:any) => {
    const element = document.getElementById(htmlId);
    if (!element) {
        console.error(`Element with ID ${htmlId} not found.`);
        return;
    }

    const content = element.innerHTML;
    const pdfContent = htmlToPdfmake(content);

    const docDefinition = {
        content: pdfContent
    };

    pdfMake.createPdf(docDefinition).open();
};
