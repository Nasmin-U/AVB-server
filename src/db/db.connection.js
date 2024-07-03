import mongoose from "mongoose";
import config from "./db.config.js";

const { uri } = config.db;

export const connectDb = async () => {
  try {
    await mongoose.connect(uri, {
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log(`Failed to connect to db: ${error.message}`);
  }
};
