import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendEmail";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, mobileNo, password, verificationCode, role } =
      req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      mobileNo,
      password: hashedPassword,
      verificationCode,
      role: role || "user",
    });

    res
      .status(201)
      .json({ status: 201, message: "User registered successfully", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loginType, email, password, emailOrMobile } = req.body;

    const identifier = loginType === "otp" ? emailOrMobile : email;

    const user = await userModel.findOne(
      loginType === "otp"
        ? { $or: [{ email: identifier }, { mobileNo: identifier }] }
        : { email: identifier }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If password login, validate password
    if (loginType === "password") {
      const isMatch = await bcrypt.compare(password, user.password ?? "");
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Respond
    res.status(200).json({
      status: 200,
      message: "User logged in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate token and hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save hashed token & expiry to user
    user.resetToken = tokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email with plain token
    await sendResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetToken: tokenHash,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const userController = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
