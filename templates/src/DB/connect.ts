import mongoose from "mongoose";

export const connectDB = async (mongoDBUrl: string) => {
    await mongoose.connect(mongoDBUrl);
    console.log("Connected to MongoDB");
}

