import { Router } from "express";
import * as contactCtrl from "../controllers/contact-controller";

const contactRouter = Router();

// contactRouter.route("/contact/list").get(contactCtrl.getAllcontacts);
// contactRouter.route("/contact/:id").get(contactCtrl.getcontactById);
contactRouter.route("/contact/add").post(contactCtrl.submitContactForm);
// contactRouter.route("/contact/update/:id").put(contactCtrl.updatecontact);
// contactRouter
//   .route("/contact/delete/:id")
//   .delete(contactCtrl.deletecontact);

export default contactRouter;
