import { Router } from "express";

import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  updateActivity,
} from "../controllers/activityController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createActivity);
router.get("/", getActivities);
router.get("/:id", getActivity);
router.patch("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
