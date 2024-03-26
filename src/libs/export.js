const { createPdf } = require('./pdf.js')
const fs = require("fs");

async function generateReportPDF(filedata){
    return (await createPdf(filedata))
}

module.exports = { generateReportPDF }