import { Router } from "express";
export const userRouter = Router();
import { userModel, courseModel, purchaseModel } from "../../db/db";
import { signinSchema, signupSchema } from "../../schema/schema";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../../middlewares/user";

userRouter.post("/signup", async function (req, res) {
  try {
    const body = req.body;
    const parsedBody = signupSchema.safeParse(body);
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
    const { email, password, firstName, lastName } = parsedBody.data;
    const user = await userModel.create({
      email,
      password,
      firstName,
      lastName,
      courses: [],
    });
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET || ""
    );
    //do cookies
    res.status(200).json({
      user,
      token: token,
      message: "user created successfully",
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

userRouter.post("/signin", async function (req, res) {
  try {
    const body = req.body;
    const parsedBody = signinSchema.safeParse(body);
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
    const { email, password } = parsedBody.data;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET || ""
    );
    //do cookies
    return res.status(200).json({
      success: true,
      token: token,
      message: "Signin successful",
      user,
    });
  } catch (error: Error | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId });
    const courseIds = purchases.map((purchase) => purchase.courseId);
    const courses = await courseModel.find({ _id: { $in: courseIds } });
    res.status(200).json({ courses });
  } catch (error: Error | any) {
    res.status(500).json({
      message: "Error getting purchases",
      error: error.message,
    });
  }
});
