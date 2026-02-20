import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let dbConnection;

export const connectDB = async () => {
  if (dbConnection) return dbConnection;

  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    dbConnection = client.db("nextdestination");
    return dbConnection;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

export const getDB = () => {
  if (!dbConnection) {
    console.warn("DB not connected yet, trying to connect...");
    return null;
  }
  return dbConnection;
};
