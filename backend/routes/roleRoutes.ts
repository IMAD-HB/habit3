import { Router } from "express";

import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createRole);
router.get("/", getRoles);
router.get("/:id", getRole);
router.patch("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
