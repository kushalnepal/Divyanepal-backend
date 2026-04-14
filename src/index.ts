import { PrismaClient } from "@prisma/client";
import express from "express";
import { errormiddleware } from "./features/Middleware/errors";
import mainRouter from "./features/routes";

const PORT = process.env.PORT || 5000;

const app = express();
const cors = require("cors");

// Allow requests from the Vercel frontend and localhost for development
const allowedOrigins = [
  "https://farm-fresh-order-hub.vercel.app",
  "https://divyanepal-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "https://divyanepal-backend-production.up.railway.app",
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) {
      // Allow requests with no origin (like mobile apps or curl requests)
      // Also allow if origin is in the allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(express.json());

export const prisma = new PrismaClient();

app.use("/api", mainRouter);

app.use(errormiddleware);

const startServer = (port: number, attempts = 3) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("CTR + C to exit");
  });

  server.on("error", (err: any) => {
    if (err && err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
      if (attempts > 0) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort}...`);
        setTimeout(() => startServer(nextPort, attempts - 1), 500);
      } else {
        console.error("No available ports. Exiting.");
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

startServer(PORT);
