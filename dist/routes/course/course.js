// src/routes/course/course.ts
import express from "express";

// src/db/db.ts
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import { Schema } from "mongoose";
var ObjectId = Types.ObjectId;
dotenv.config();
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}
mongoose.connect(process.env.MONGODB_URI);
var userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  courses: [ObjectId]
});
var adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  courses: [ObjectId]
});
var courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId
});
var purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId
});
var userModel = mongoose.model("User", userSchema);
var adminModel = mongoose.model("Admin", adminSchema);
var courseModel = mongoose.model("Course", courseSchema);
var purchaseModel = mongoose.model("Purchase", purchaseSchema);

// src/middlewares/user.ts
import jwt from "jsonwebtoken";
var userMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing or invalid");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    );
    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      throw new Error("Invalid token payload or jwt secret");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized"
    });
  }
};

// src/routes/course/course.ts
var courseRouter = express.Router();
courseRouter.post("/purchase", userMiddleware, async function(req, res) {
  try {
    const userId = req.userId;
    const courseId = req.body.courseId;
    await purchaseModel.create({
      userId,
      courseId
    });
    await userModel.findByIdAndUpdate(userId, {
      $push: { courses: courseId }
    });
    res.json({
      message: "Course purchased successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error purchasing course",
      error: error.message
    });
  }
});
courseRouter.get("/", async function(req, res) {
  const courses = await courseModel.find();
  res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    courses
  });
});
export {
  courseRouter
};
//# sourceMappingURL=course.js.map