import { PrismaClient } from "@prisma/client";
import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error);
  }
}

startServer();
