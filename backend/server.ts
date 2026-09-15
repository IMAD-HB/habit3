import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import weeklyPlanRoutes from "./routes/weeklyPlanRoutes.js";
import timeBlockRoutes from "./routes/timeBlockRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
