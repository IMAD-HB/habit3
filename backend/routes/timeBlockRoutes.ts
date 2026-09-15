import { Router } from "express";

import {
  createTimeBlock,
  deleteTimeBlock,
  getTimeBlock,
  getTimeBlocks,
  updateTimeBlock,
} from "../controllers/timeBlockController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createTimeBlock);
router.get("/", getTimeBlocks);
router.get("/:id", getTimeBlock);
router.patch("/:id", updateTimeBlock);
router.delete("/:id", deleteTimeBlock);

export default router;
