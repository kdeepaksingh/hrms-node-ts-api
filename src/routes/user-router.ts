import { Router } from "express";
import { userController } from "../controllers/user-controller";

const userRouter = Router();

userRouter.route("/register").post(userController.registerUser);
userRouter.route("/login").post(userController.loginUser);
userRouter.route("/forgot-password").post(userController.forgotPassword);
userRouter.route("/send-email-otp").post(userController.sendEmailOtp);
userRouter.route("/verify-email-otp").post(userController.verifyEmailOtp);
userRouter.route("/reset-password/:token").post(userController.resetPassword);

export default userRouter;
