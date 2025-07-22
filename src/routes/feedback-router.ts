import { Router } from "express";
import * as feedbackCtrl from "../controllers/feedback-controller";

const feedbackRouter = Router();

feedbackRouter.route("/feedback/list").get(feedbackCtrl.getAllFeedbacks);
feedbackRouter.route("/feedback/:id").get(feedbackCtrl.getFeedbackById);
feedbackRouter.route("/feedback/add").post(feedbackCtrl.createFeedback);
feedbackRouter.route("/feedback/update/:id").put(feedbackCtrl.updateFeedback);
feedbackRouter
  .route("/feedback/delete/:id")
  .delete(feedbackCtrl.deleteFeedback);

export default feedbackRouter;
