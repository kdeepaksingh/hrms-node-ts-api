import { Request, Response } from "express";
import { Employee } from "../models/employeeModel";
import { generateEmployeePDF } from "../utils/pdfGenerator";

export const getEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { search, department, designation } = req.query;

  const query: any = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search as string, $options: "i" } },
      { lastName: { $regex: search as string, $options: "i" } },
      { email: { $regex: search as string, $options: "i" } },
      { employeeId: { $regex: search as string, $options: "i" } },
    ];
  }
  if (department) query.department = department;
  if (designation) query.designation = designation;

  const employees = await Employee.find(query);
  res.json(employees);
};

export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  res.json(employee);
};

export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employeeId,
      address,
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`; // e.g., http://localhost:8000

    const profilePhotoUrl =
      req.files && (req.files as any).profilePhoto
        ? `${baseUrl}/${(req.files as any).profilePhoto[0].path.replace(
            /\\/g,
            "/"
          )}`
        : undefined;

    const resumeUrl =
      req.files && (req.files as any).resume
        ? `${baseUrl}/${(req.files as any).resume[0].path.replace(/\\/g, "/")}`
        : undefined;

    // const profilePhotoUrl =
    //   req.files && (req.files as any).profilePhoto
    //     ? (req.files as any).profilePhoto[0].path
    //     : undefined;
    // const resumeUrl =
    //   req.files && (req.files as any).resume
    //     ? (req.files as any).resume[0].path
    //     : undefined;

    const employee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employeeId,
      address,
      profilePhotoUrl,
      resumeUrl,
    });

    await employee.save();

    res.status(201).json({
      status: "success",
      message: "Employee created successfully!",
      data: employee,
    });
  } catch (error: any) {
    console.error("Error creating employee:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(400).json({
        status: "fail",
        message: `Duplicate value for ${duplicateField}: '${error.keyValue[duplicateField]}' already exists.`,
      });
      return;
    }

    res.status(500).json({
      status: "error",
      message: "An unexpected server error occurred. Please try again later.",
    });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateData: any = { ...req.body };

    if (req.files) {
      if ((req.files as any).profilePhoto) {
        updateData.profilePhotoUrl = (req.files as any).profilePhoto[0].path;
      }
      if ((req.files as any).resume) {
        updateData.resumeUrl = (req.files as any).resume[0].path;
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

export const downloadEmployeePDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  generateEmployeePDF(res, employee);
};
