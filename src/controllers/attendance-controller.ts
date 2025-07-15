import { Request, Response } from "express";
import { AttendanceModel } from "../models/attendanceModel";

/**
 * @desc Mark Attendance
 */
export const markAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const record = new AttendanceModel(req.body);
    await record.save();

    res.status(201).json({
      status: "success",
      message: "Attendance marked successfully!",
      data: record,
    });
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to mark attendance. Please try again later.",
    });
  }
};

/**
 * @desc Get All Attendance (with optional filters)
 */
export const getAllAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, status, date, employeeId } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { employeeName: { $regex: search as string, $options: "i" } },
        { employeeId: { $regex: search as string, $options: "i" } },
        { remarks: { $regex: search as string, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;
    if (date) query.date = date;

    const data = await AttendanceModel.find(query).sort({ date: -1 });

    res.json({
      status: "success",
      count: data.length,
      data,
    });
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch attendance data.",
    });
  }
};

/**
 * @desc Get Attendance By Employee ID
 */
export const getAttendanceByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const records = await AttendanceModel.find({ employeeId: userId }).sort({
      date: -1,
    });

    if (!records || records.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "No attendance records found for this user.",
      });
      return;
    }

    res.json({
      status: "success",
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    console.error("Error fetching user attendance:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user's attendance data.",
    });
  }
};

/**
 * @desc Update Attendance
 */
export const updateAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecord = await AttendanceModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedRecord) {
      res.status(404).json({
        status: "fail",
        message: "Attendance record not found.",
      });
      return;
    }

    res.json({
      status: "success",
      message: "Attendance updated successfully!",
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update attendance record.",
    });
  }
};
