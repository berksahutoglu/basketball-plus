import express from "express";
import {
  addJoinRequest,
  getAllJoinRequests,
  respondToJoinRequest,
  getApprovedRequests,
} from "../controllers/joinRequest.js";

const router = express.Router();

router.post("/", addJoinRequest);
router.get("/", getAllJoinRequests);
router.post("/respond", respondToJoinRequest);
router.get("/approved/:eventId", getApprovedRequests);

export default router;
