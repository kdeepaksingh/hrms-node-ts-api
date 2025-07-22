import { Request, Response } from "express";
import { ContactModel } from "../models/contactModel";

export const submitContactForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await ContactModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Contact created successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating feedback", error });
  }
};
