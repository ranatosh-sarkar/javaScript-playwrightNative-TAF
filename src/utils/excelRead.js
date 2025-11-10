const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

class ExcelReader {
  static readExcel(filePath, sheetName) {
    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath); // resolve from project root

    if (!fs.existsSync(abs)) {
      throw new Error(`Excel not found at: ${abs}`);
    }
    const wb = XLSX.readFile(abs);
    const sheet = sheetName ? wb.Sheets[sheetName] : wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found. Available: ${wb.SheetNames.join(', ')}`);
    }
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }
}
module.exports = ExcelReader;
