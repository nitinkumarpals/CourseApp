import express from "express";
import { courseModel, purchaseModel, userModel } from "../../db/db";
import { userMiddleware } from "../../middlewares/user";
export const courseRouter = express.Router();
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const courseId = req.body.courseId;
    // you would expect the user to pay you money
    await purchaseModel.create({
      userId,
      courseId,
    });
    await userModel.findByIdAndUpdate(userId, {
      $push: { courses: courseId },
    });
    res.json({
      message: "Course purchased successfully",
    });
  } catch (error : Error | any) {
    console.error(error);
    res.status(500).json({
      message: "Error purchasing course",
      error: error.message,
    });
  }
});

courseRouter.get("/", async function (req, res) {
  const courses = await courseModel.find();
  res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    courses: courses
  })
});
