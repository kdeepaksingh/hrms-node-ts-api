import { Request, Response } from "express";
import feedbackModel from "../models/feedbackModel";

export const createFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedback = await feedbackModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Feedback created successfully!",
      data: feedback,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating feedback", error });
  }
};

export const getAllFeedbacks = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedbacks = await feedbackModel.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks", error });
  }
};

export const getFeedbackById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedback = await feedbackModel.findById(req.params.id);
    if (!feedback) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving feedback", error });
  }
};

export const updateFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await feedbackModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating feedback", error });
  }
};

export const deleteFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await feedbackModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error });
  }
};
