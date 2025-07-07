import { Router } from "express";
import { userController } from "../controllers/user-controller";

const userRouter = Router();

userRouter.route("/register").post(userController.registerUser);
userRouter.route("/login").post(userController.loginUser);
userRouter.route("/forgot-password").post(userController.forgotPassword);
userRouter.route("/reset-password/:token").post(userController.resetPassword);

export default userRouter;
