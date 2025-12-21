"use client";

import ExcelJS from "exceljs";

type MetaRow = { label: string; value: string };

type BrandedXlsxInput<T extends Record<string, any>> = {
  filename: string;
  sheetName: string;
  title: string;
  companyName: string;
  logoUrl?: string;
  logoExtension?: "png" | "jpeg" | "jpg";
  meta?: MetaRow[];
  columns: Array<{ header: string; key: keyof T; width?: number }>;
  rows: T[];
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function exportBrandedXlsx<T extends Record<string, any>>({
  filename,
  sheetName,
  title,
  companyName,
  logoUrl,
  logoExtension = "png",
  meta = [],
  columns,
  rows,
}: BrandedXlsxInput<T>) {
  const wb = new ExcelJS.Workbook();
  wb.creator = companyName;
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName);

  const totalCols = Math.max(columns.length, 1);

  let rowCursor = 1;

  if (logoUrl) {
    try {
      const res = await fetch(logoUrl);
      const buf = await res.arrayBuffer();
      const imageId = wb.addImage({
        buffer: buf,
        extension: logoExtension === "jpg" ? "jpeg" : logoExtension,
      });

      ws.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 64, height: 64 },
      });

      ws.getRow(rowCursor).height = 48;
    } catch {
      // ignore logo errors
    }
  }

  ws.mergeCells(rowCursor, 1, rowCursor, totalCols);
  const titleCell = ws.getCell(rowCursor, 1);
  titleCell.value = title;
  titleCell.font = {
    name: "Calibri",
    size: 16,
    bold: true,
    color: { argb: "FF0F2A2E" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  rowCursor += 1;

  ws.mergeCells(rowCursor, 1, rowCursor, totalCols);
  const companyCell = ws.getCell(rowCursor, 1);
  companyCell.value = companyName;
  companyCell.font = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: "FF0F766E" },
  };
  companyCell.alignment = { vertical: "middle", horizontal: "center" };
  rowCursor += 1;

  if (meta.length > 0) {
    for (const m of meta) {
      ws.mergeCells(
        rowCursor,
        1,
        rowCursor,
        Math.max(1, Math.floor(totalCols / 2))
      );
      ws.mergeCells(
        rowCursor,
        Math.max(2, Math.floor(totalCols / 2) + 1),
        rowCursor,
        totalCols
      );

      const l = ws.getCell(rowCursor, 1);
      l.value = m.label;
      l.font = {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: "FF475569" },
      };
      l.alignment = { vertical: "middle", horizontal: "left" };

      const v = ws.getCell(
        rowCursor,
        Math.max(2, Math.floor(totalCols / 2) + 1)
      );
      v.value = m.value;
      v.font = {
        name: "Calibri",
        size: 10,
        bold: false,
        color: { argb: "FF0B0F19" },
      };
      v.alignment = { vertical: "middle", horizontal: "left" };

      rowCursor += 1;
    }
  }

  rowCursor += 1;

  ws.columns = columns.map((c) => ({
    header: c.header,
    key: String(c.key),
    width: c.width ?? 18,
  }));

  const headerRowIndex = rowCursor;
  const headerRow = ws.getRow(rowCursor);
  headerRow.values = columns.map((c) => c.header);
  headerRow.font = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;

  for (let i = 1; i <= totalCols; i++) {
    const cell = ws.getCell(rowCursor, i);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F766E" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  }

  rowCursor += 1;

  for (const r of rows) {
    const dataRow = ws.getRow(rowCursor);
    dataRow.values = columns.map((c) => (r as any)[c.key]);
    dataRow.font = { name: "Calibri", size: 10 };
    dataRow.alignment = { vertical: "top", horizontal: "left", wrapText: true };

    for (let i = 1; i <= totalCols; i++) {
      const cell = ws.getCell(rowCursor, i);
      cell.border = {
        top: { style: "thin", color: { argb: "FFF1F5F9" } },
        left: { style: "thin", color: { argb: "FFF1F5F9" } },
        bottom: { style: "thin", color: { argb: "FFF1F5F9" } },
        right: { style: "thin", color: { argb: "FFF1F5F9" } },
      };
    }

    rowCursor += 1;
  }

  ws.views = [{ state: "frozen", ySplit: headerRowIndex }];

  const buffer = await wb.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
}
