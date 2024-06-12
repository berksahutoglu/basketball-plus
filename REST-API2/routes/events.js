import express from "express";
import { addEvent, getEvents } from "../controllers/event.js";

const router = express.Router();

router.post("/", addEvent);
router.get("/", getEvents);

export default router;
