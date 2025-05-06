import mongoose from "mongoose";

const connection = {};

export const connectToDB = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }

    if (!process.env.MONGO) {
      throw new Error("Please define the MONGO environment variable");
    }

    const db = await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("New connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
};
