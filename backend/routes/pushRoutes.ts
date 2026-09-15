import { Router } from "express";

import { subscribeToPush } from "../controllers/pushController.js";

import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/subscribe", subscribeToPush);

export default router;
