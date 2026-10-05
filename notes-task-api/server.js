import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
================================================
          NOTES/TASK API backend 
================================================
MONGODB: online
PORT :${PORT}
Server: http://localhost:${PORT}
health url: http://localhost:${PORT}/api/health
        `);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();