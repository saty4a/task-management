import mongoose from "mongoose";
import config from "./config.js";

mongoose.connect(`mongodb+srv://${config.username}:${config.password}@cluster0.mca0ul4.mongodb.net/${config.dbName}`,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export const database = mongoose.connection;

database.on("error", (error) => {
    console.log("Error in MongoDB connection: " + error);
})

database.once("open",() => {
    console.log("connected successfully");
})