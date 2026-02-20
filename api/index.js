import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../src/db/connect.js";

// Routes
import destinationsRouter from "../src/routes/destinations.js";
import journalsRouter from "../src/routes/journals.js";

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/destinations", destinationsRouter);
app.use("/api/journals", journalsRouter);

// Database initialization
connectDB().catch(console.dir);

const PORT = process.env.PORT || 3000;

// Only listen if not handled by Vercel serverless function
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
