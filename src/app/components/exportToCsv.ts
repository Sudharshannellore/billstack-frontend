/** Shared CSV export helper — extracted from the duplicated logic in Customers/Subscriptions pages. */
export function exportToCsv<T>(
  rows: T[],
  headers: string[],
  toRow: (row: T) => (string | number)[],
  filename: string,
) {
  const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows.map((r) => toRow(r).map(String))]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
