import express from "express";
import {
  getUser,
  updateUser,
  searchUsers,
  updateUserCredentials,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:user_id", getUser);
router.put("/:user_id", updateUser);
router.get("/search", searchUsers); // Yeni eklenen arama route'u
router.put("/update/:id", updateUserCredentials); // Yeni eklenen arama route'u

export default router;
