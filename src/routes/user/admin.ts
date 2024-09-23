import { Router } from "express";
export const adminRouter = Router();
import { adminModel, courseModel } from "../../db/db";
import { signinSchema, signupSchema, courseSchema } from "../../schema/schema";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../../middlewares/admin";
import { Request, Response, NextFunction } from "express";
adminRouter.post("/signup", async function (req, res) {
  try {
    const body = req.body;
    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      const errorMessages = parsedBody.error.errors
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }
    const { email, password, firstName, lastName } = parsedBody.data;
    const admin = await adminModel.create({
      email,
      password,
      firstName,
      lastName,
      courses: [],
    });
    const token = jwt.sign(
      {
        email: admin.email,
        id: admin._id,
      },
      process.env.JWT_SECRET_ADMIN || ""
    );
    //do cookies
    res.status(200).json({
      success: true,
      admin,
      token: token,
      message: "Admin and course created successfully",
    });
  } catch (error: Error | any) {
    if (error instanceof Error && (error as any).code === 11000) {
      // Unique constraint error code
      return res.status(400).json({
        success: false,
        error: "Email already exists",
        message: "Email already in use",
      });
    } else {
      // Handle other errors
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server error",
      });
    }
  }
});

adminRouter.post("/signin", async function (req, res) {
  try {
    const body = req.body;
    const parsedBody = signinSchema.safeParse(body);
    if (!parsedBody.success) {
      const errorMessages = parsedBody.error.errors
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }
    const { email, password } = parsedBody.data;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (admin.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        email: admin.email,
        id: admin._id,
      },
      process.env.JWT_SECRET_ADMIN || ""
    );
    //do cookies
    return res.status(200).json({
      success: true,
      token: "Bearer " + token,
      message: "Signin successful",
      admin,
    });
  } catch (error: Error | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.adminId;
    const body = req.body;
    const parsedBody = courseSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: " +
          parsedBody.error.errors
            .map((err) => `${err.path[0]} ${err.message}`)
            .join(", "),
      });
    }
    const { title, description, imageUrl, price } = parsedBody.data;

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    });

    await adminModel.findByIdAndUpdate(adminId, {
      $push: { courses: course._id },
    });
    res.json({
      message: "Course created",
      courseId: course._id,
    });
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: `Error creating course: ${error.message}`,
    });
  }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.adminId;
    const body = req.body;
    const parsedBody = courseSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: " +
          parsedBody.error.errors.map((err) => err.message).join(", "),
      });
    }
    const { title, description, price, imageUrl, courseId } = parsedBody.data;
    const course = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, price, imageUrl },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error: Error | any) {
    console.error(error); // log the error
    res.status(500).json({
      success: false,
      message: `Error updating course: ${error.message}`,
    });
  }
});

adminRouter.get("/course/bulk",adminMiddleware,
  async function (req: Request, res: Response) {
    const adminId = req.adminId;
    const courses = await courseModel.find({ creatorId: adminId });
    res.status(200).json({
      success: true,
      message: "course endpoint",
      courses,
    });
  }
);
