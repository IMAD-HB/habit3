import { Router } from "express";

import {
  createWeeklyPlan,
  deleteWeeklyPlan,
  getWeeklyPlan,
  getWeeklyPlans,
  updateWeeklyPlan,
} from "../controllers/weeklyPlanController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createWeeklyPlan);
router.get("/", getWeeklyPlans);
router.get("/:id", getWeeklyPlan);
router.patch("/:id", updateWeeklyPlan);
router.delete("/:id", deleteWeeklyPlan);

export default router;
