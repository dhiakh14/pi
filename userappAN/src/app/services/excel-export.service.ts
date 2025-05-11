import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor() {}

  /**
   * Exports data to an Excel file.
   * @param data - The data to export (array of objects).
   * @param fileName - The name of the Excel file (without extension).
   * @param sheetName - The name of the sheet in the Excel file.
   */
  exportToExcel(data: any[], fileName: string, sheetName: string): void {
    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    };

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}