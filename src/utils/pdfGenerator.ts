import PDFDocument from "pdfkit";
import { Response } from "express";

export const generateEmployeePDF = (res: Response, employee: any) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=employee-${employee.employeeId}.pdf`
  );

  doc.fontSize(20).text("Employee Details", { align: "center" }).moveDown();

  doc.fontSize(12);
  doc.text(`First Name: ${employee.firstName}`);
  doc.text(`Last Name: ${employee.lastName}`);
  doc.text(`Email: ${employee.email}`);
  doc.text(`Phone: ${employee.phone}`);
  doc.text(`Date of Birth: ${new Date(employee.dob).toLocaleDateString()}`);
  doc.text(`Gender: ${employee.gender}`);
  doc.text(`Department: ${employee.department}`);
  doc.text(`Designation: ${employee.designation}`);
  doc.text(
    `Joining Date: ${new Date(employee.joiningDate).toLocaleDateString()}`
  );
  doc.text(`Employee ID: ${employee.employeeId}`);
  doc.text(`Address: ${employee.address}`);

  doc.end();
  doc.pipe(res);
};
