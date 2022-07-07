const XLSX = require('xlsx');

let filename = 'google-page-speed-insight.xlsx';
let ws;
let wb;

let createXlsx = () => {
    wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet([
        ['Date', 'Mobile Core Web Vitals', 'FID', 'LCP', 'CLS', 'Desktop Core Web Vitals', 'FID', 'LCP', 'CLS']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Google Page Speed Insight");
}

let addRowToXlsx = (data) => {
    XLSX.utils.sheet_add_aoa(ws, [data], { origin: "A2"});
    XLSX.writeFileXLSX(wb, filename, {});
}

export { createXlsx, addRowToXlsx };
