import { Router } from "express";
import * as attendanceCtrl from "../controllers/attendance-controller";
import { upload } from "../middlewares/upload";

const attendanceRouter = Router();

const uploadFields = upload.fields([{ name: "attachment", maxCount: 1 }]);

attendanceRouter.route("/attendance/list").get(attendanceCtrl.getAllAttendance);

attendanceRouter
  .route("/attendance/list/:employeeId")
  .get(attendanceCtrl.getAttendanceByUser);

attendanceRouter
  .route("/attendance/add")
  .post(uploadFields, attendanceCtrl.markAttendance);

attendanceRouter
  .route("/attendance/update/:id")
  .put(attendanceCtrl.updateAttendance);

export default attendanceRouter;
