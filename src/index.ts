import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {userRouter} from "./routes/user/user";
import { adminRouter } from "./routes/user/admin";
import { courseRouter } from "./routes/course/course.js";
import mongoose from "mongoose";
const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function start() {
  await mongoose.connect(process.env.MONGODB_URI || "");
  console.log("connected to db");
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });
}

start();
