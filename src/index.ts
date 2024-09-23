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
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome to my app!</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to my app!</h1>
        <p>This is a courseApp.</p>
      </body>
    </html>
  `);
});
async function start() {
  await mongoose.connect(process.env.MONGODB_URI || "");
  console.log("connected to db");
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });
}

start();
