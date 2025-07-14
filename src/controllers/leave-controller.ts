import { Request, Response } from "express";
import { LeaveModel } from "../models/leaveModel";

export const createLeave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      employeeId,
      leaveType,
      dayType,
      fromDate,
      toDate,
      reason,
      includeWeekend,
      applyingTo,
      ccEmails,
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const attachmentUrl =
      req.files && (req.files as any).attachment
        ? `${baseUrl}/${(req.files as any).attachment[0].path.replace(
            /\\/g,
            "/"
          )}`
        : undefined;

    const leave = new LeaveModel({
      employeeId,
      leaveType,
      dayType,
      fromDate,
      toDate,
      reason,
      includeWeekend,
      applyingTo,
      ccEmails: Array.isArray(ccEmails) ? ccEmails : [ccEmails],
      attachment: attachmentUrl,
      status: "pending",
    });

    await leave.save();

    res.status(201).json({
      status: "success",
      message: "Leave applied successfully!",
      data: leave,
    });
  } catch (error: any) {
    console.error("Error applying leave:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected server error occurred. Please try again later.",
    });
  }
};

export const getAllLeaves = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const leaves = await LeaveModel.find();
    res.status(200).json({
      status: "success",
      data: leaves,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leave requests.",
    });
  }
};

export const getLeavesByEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const leaves = await LeaveModel.find({ employeeId });
    res.status(200).json({
      status: "success",
      data: leaves,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employee leave data.",
    });
  }
};

export const updateLeaveStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ status: "fail", message: "Invalid status value." });
      return;
    }

    const leave = await LeaveModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!leave) {
      res.status(404).json({ status: "fail", message: "Leave not found." });
      return;
    }

    res.status(200).json({
      status: "success",
      message: `Leave ${status} successfully!`,
      data: leave,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to update leave status.",
    });
  }
};

export const cancelLeave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const leave = await LeaveModel.findByIdAndDelete(id);

    if (!leave) {
      res.status(404).json({ status: "fail", message: "Leave not found." });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Leave cancelled successfully!",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to cancel leave.",
    });
  }
};
