import mongoose from "mongoose";

const connection = {};

export const connectToDB = async () => {
  try {
    // If we're already connected, return immediately
    if (connection.isConnected === 1) {
      console.log("Using existing connection");
      return;
    }

    // If we're in the process of connecting, wait for it
    if (connection.isConnected === 2) {
      console.log("Connection in progress, waiting...");
      return;
    }

    // Check if mongoose is connected
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      console.log("Using existing mongoose connection");
      connection.isConnected = 1;
      return;
    }

    if (!process.env.MONGO) {
      console.error("MONGO environment variable is not defined");
      throw new Error("Please define the MONGO environment variable");
    }

    // Set connection state to "connecting"
    connection.isConnected = 2;

    // Set up connection event listeners before connecting
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to database");
      connection.isConnected = 1;
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
      connection.isConnected = 0;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
      connection.isConnected = 0;
    });

    console.log("Attempting to connect to MongoDB...");
    const db = await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log(
      "New connection established with state:",
      connection.isConnected
    );
  } catch (error) {
    console.error("Database connection error:", error);
    connection.isConnected = 0;
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
};
