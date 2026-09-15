import "./config/env.js";

import cors from "cors";
import express from "express";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import weeklyPlanRoutes from "./routes/weeklyPlanRoutes.js";
import timeBlockRoutes from "./routes/timeBlockRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";

import { startTimeBlockNotificationScheduler } from "./services/timeBlockNotificationScheduler.js";

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const err = new Error("Not allowed by CORS") as Error & {
        status?: number;
      };

      err.status = 403;
      callback(err);
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Habit 3 API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/weekly-plans", weeklyPlanRoutes);
app.use("/api/time-blocks", timeBlockRoutes);
app.use("/api/push", pushRoutes);

const startServer = async (): Promise<void> => {
  await connectDB();

  startTimeBlockNotificationScheduler();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
