import { Router } from "express";

import {
  changePassword,
  deleteAccount,
  getMe,
  login,
  register,
  updateAccount,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.patch("/me", protect, updateAccount);

router.patch("/password", protect, changePassword);

router.delete("/me", protect, deleteAccount);

export default router;
