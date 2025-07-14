import PDFDocument from "pdfkit";
import { Response } from "express";

export const generatePayrollPDF = (res: Response, data: any) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payroll-${data.month}.pdf`
  );
  doc.text(`Payroll Slip`, { align: "center" }).moveDown();
  doc.text(`Employee: ${data.employeeId}`);
  doc.text(`Salary: ₹${data.salary}`);
  doc.text(`Month: ${data.month}`);
  doc.end();
  doc.pipe(res);
};
