import dotenv from "dotenv";
import { connectDB } from "./DB/connect.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import mongoose from "mongoose";

dotenv.config();


const startServer = async () => {

    if (!process.env.MONGO_DB_URL) {
        throw new Error("MONGO_DB_URL is not defined");
    }

    await connectDB(process.env.MONGO_DB_URL);

    const app = express();
    app.use(cors({ credentials: true }))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use("/api", routes)

    const server = app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    })

    const shutdown = async (signal: string) => {
        console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);

        server.close(async () => {
            console.log("🛑 HTTP server closed.");
            await mongoose.connection.close();
            console.log("🗄️ MongoDB connection closed.");
            process.exit(0);
        });

        // Fallback: if it hangs >10s, force exit.
        setTimeout(() => {
            console.error("⚠️ Force exit due to timeout.");
            process.exit(1);
        }, 10000);
    };


    process.on("SIGINT", () => shutdown("SIGINT")); 
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}


startServer()