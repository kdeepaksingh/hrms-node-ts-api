import mongoose from "mongoose";

export interface IAttendance extends mongoose.Document {
  employeeId: string;
  employeeName: string;
  attendanceDate: Date;
  attendanceType: "office" | "remote" | "field";
  department: string;
  designation: string;
  gender: string;
  inTime?: Date | null;
  outTime?: Date | null;
  reason?: string;
  status: "present" | "absent" | "leave" | "wfh" | "half day" | "late";
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema<IAttendance>(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    attendanceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "wfh", "half day", "late"],
      required: true,
    },
    attendanceType: {
      type: String,
      enum: ["office", "remote", "field"],
      required: true,
    },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    inTime: { type: String, default: null },
    outTime: { type: String, default: null },
    reason: { type: String, default: "" },
    attachment: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
