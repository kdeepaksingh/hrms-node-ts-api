import { Router } from "express";
import { upload } from "../middlewares/upload";

import * as employeeCtrl from "../controllers/employee-controller";

const employeeRouter = Router();

// Multer fields for multiple files upload (profilePhoto, resume)
const uploadFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

employeeRouter.route("/employees/list").get(employeeCtrl.getEmployees);
employeeRouter.route("//employeeslist/:id").get(employeeCtrl.getEmployeeById);
employeeRouter
  .route("/employees/add")
  .post(uploadFields, employeeCtrl.createEmployee);
employeeRouter
  .route("/employees/update/:id")
  .put(uploadFields, employeeCtrl.updateEmployee);
employeeRouter
  .route("/employees/delete/:id")
  .delete(employeeCtrl.deleteEmployee);
employeeRouter
  .route("/employees/download/pdf/:id")
  .get(employeeCtrl.downloadEmployeePDF);

export default employeeRouter;
