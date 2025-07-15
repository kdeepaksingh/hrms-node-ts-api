import { Request, Response } from "express";
import { LeaveModel } from "../models/leaveModel";
import { buildQuery, getPagination } from "../utils/queryFeatures";

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

export const getLeaveSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const totalToday = await LeaveModel.countDocuments({
      fromDate: { $lte: today },
      toDate: { $gte: today },
    });

    const totalRequest = await LeaveModel.countDocuments(); // All leave records
    const totalApproved = await LeaveModel.countDocuments({
      status: "approved",
    });
    const totalPending = await LeaveModel.countDocuments({ status: "pending" });
    const totalRejected = await LeaveModel.countDocuments({
      status: "rejected",
    });

    const thisMonth = await LeaveModel.countDocuments({
      fromDate: { $gte: startOfMonth },
    });

    // Group by leaveType
    const leaveTypeSummary = await LeaveModel.aggregate([
      {
        $group: {
          _id: "$leaveType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object for easy access
    const leaveTypeCounts = leaveTypeSummary.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      totalToday,
      totalRequest,
      totalApproved,
      totalPending,
      totalRejected,
      thisMonth,
      leaveTypes: {
        casualLeave: leaveTypeCounts["casual"] || 0,
        earnedLeave: leaveTypeCounts["earned"] || 0,
        sickLeave: leaveTypeCounts["sick"] || 0,
        shortLeave: leaveTypeCounts["short"] || 0,
        breavementLeave: leaveTypeCounts["breavement"] || 0,
        compoffLeave: leaveTypeCounts["compoff"] || 0,
      },
    });
  } catch (error) {
    console.error("Error in getLeaveSummary:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leave summary",
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

export const postLeave = async (req: Request, res: Response) => {
  const leave = new LeaveModel({
    ...req.body,
    userId: (req as any).user.userId,
  });
  await leave.save();
  res.status(201).json(leave);
};

export const getLeaves = async (req: Request, res: Response) => {
  const query = buildQuery(req.query, ["leaveType", "reason"]);
  const { skip, limit } = getPagination(req.query);
  const leaves = await LeaveModel.find(query).skip(skip).limit(limit);
  res.json(leaves);
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
    const { id, status } = req.params;

    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      res
        .status(400)
        .json({ status: "fail", message: "Invalid status value." });
      return;
    }

    const leave = await LeaveModel.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
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
