import { Router } from "express";
import { upload } from "../middlewares/upload";
import * as leaveCtrl from "../controllers/leave-controller";

const leaveRouter = Router();
// Multer fields for multiple files upload (profilePhoto, resume)
const uploadFields = upload.fields([{ name: "attachment", maxCount: 1 }]);

leaveRouter.route("/leaves/list").get(leaveCtrl.getAllLeaves);
leaveRouter.route("/leave/summary").get(leaveCtrl.getLeaveSummary);
leaveRouter.route("/leave/list/:employeeId").get(leaveCtrl.getLeavesByEmployee);
leaveRouter.route("/leave/add").post(uploadFields, leaveCtrl.createLeave);
leaveRouter
  .route("/leave/update/:id/:status")
  .put(uploadFields, leaveCtrl.updateLeaveStatus);
leaveRouter.route("/leave/delete/:id").delete(leaveCtrl.cancelLeave);

export default leaveRouter;
