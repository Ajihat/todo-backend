import express from "express";
import cors from "cors";
import helmet from "helmet";

import { db } from "./config/db";

import authRoutes from "./routes/auth.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API działa 🚀",
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
