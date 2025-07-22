import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      match: /^[A-Za-z\s.'-]+$/,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    feedbackCategory: {
      type: String,
      required: true,
      enum: ["User_Experience", "Ui_Functionality", "Suggestion_Improvements"],
    },
    mobileNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    comments: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
