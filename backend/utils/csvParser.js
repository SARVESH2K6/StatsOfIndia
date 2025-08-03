const fs = require('fs');
const path = require('path');

/**
 * Parse CSV file and return preview data
 * @param {string} filePath - Path to the CSV file
 * @param {number} maxRows - Maximum number of rows to return (default: 10)
 * @returns {Object} - Parsed CSV data with headers and rows
 */
function parseCSVPreview(filePath, maxRows = 10) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split content into lines
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return {
        headers: [],
        rows: [],
        totalRows: 0,
        totalColumns: 0
      };
    }

    // Parse headers (first line)
    const headers = parseCSVLine(lines[0]);
    
    // Parse data rows (limit to maxRows)
    const dataRows = [];
    const rowsToProcess = Math.min(lines.length - 1, maxRows);
    
    for (let i = 1; i <= rowsToProcess; i++) {
      const row = parseCSVLine(lines[i]);
      dataRows.push(row);
    }

    return {
      headers,
      rows: dataRows,
      totalRows: lines.length - 1, // Exclude header row
      totalColumns: headers.length,
      hasMoreRows: lines.length - 1 > maxRows
    };
  } catch (error) {
    throw new Error(`Error parsing CSV file: ${error.message}`);
  }
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array} - Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  values.push(current.trim());
  
  return values;
}

/**
 * Get file statistics for CSV files
 * @param {string} filePath - Path to the CSV file
 * @returns {Object} - File statistics
 */
function getCSVStats(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return {
        totalRows: 0,
        totalColumns: 0,
        fileSize: 0
      };
    }

    const headers = parseCSVLine(lines[0]);
    const stats = fs.statSync(filePath);

    return {
      totalRows: lines.length - 1, // Exclude header
      totalColumns: headers.length,
      fileSize: stats.size,
      lastModified: stats.mtime
    };
  } catch (error) {
    throw new Error(`Error getting CSV stats: ${error.message}`);
  }
}

module.exports = {
  parseCSVPreview,
  getCSVStats
}; 