import mongoose from "mongoose";

export interface IAttendance extends mongoose.Document {
  employeeId: string;
  employeeName: string;
  date: string; // Format: YYYY-MM-DD
  inTime?: string;
  outTime?: string;
  status: "present" | "absent" | "leave" | "wfh" | "half day";
  attendanceType: "office" | "remote" | "field";
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema<IAttendance>(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    date: { type: String, required: true },
    inTime: String,
    outTime: String,
    status: {
      type: String,
      enum: ["present", "absent", "leave", "wfh", "half day"],
      required: true,
    },
    attendanceType: {
      type: String,
      enum: ["office", "remote", "field"],
      required: true,
    },
    remarks: String,
  },
  { timestamps: true }
);

export const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
