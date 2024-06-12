import express from "express";
import {
  getEventComments,
  addEventComment,
  getPerformanceReview,
} from "../controllers/eventComment.js";

const router = express.Router();

router.get("/", getEventComments);
router.post("/", addEventComment);
router.post("/getPerformanceReview", getPerformanceReview);

export default router;
