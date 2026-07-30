// Minimal RFC 4180 CSV read/write — no external dependency for a feature
// this small. Handles quoted fields, embedded commas, and escaped quotes;
// doesn't handle embedded newlines inside a quoted field on parse (none of
// the data this is used for — pricing override rows — ever contains one).

export function stringifyCsv(rows: string[][]): string {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
}

// Prefixes values that would be interpreted as a formula by Excel/Sheets
// (=, +, -, @, tab, CR) with a leading apostrophe — CSV formula-injection
// protection for anything an admin later opens in a spreadsheet app.
function csvEscape(value: string): string {
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) {
    v = `'${v}`;
  }
  if (/[",\r\n]/.test(v)) {
    v = `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const normalized = text.replace(/\r\n/g, "\n");

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}
