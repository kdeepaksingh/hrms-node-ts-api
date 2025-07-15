import { Router } from "express";
import * as attendanceCtrl from "../controllers/attendance-controller";

const attendanceRouter = Router();

attendanceRouter.route("/attendance/list").get(attendanceCtrl.getAllAttendance);

attendanceRouter
  .route("/attendance/list/:employeeId")
  .get(attendanceCtrl.getAttendanceByUser);

attendanceRouter.route("/attendance/add").post(attendanceCtrl.markAttendance);

attendanceRouter
  .route("/attendance/update/:id")
  .put(attendanceCtrl.updateAttendance);

export default attendanceRouter;
