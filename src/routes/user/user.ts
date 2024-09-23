import { Router } from "express";
export const userRouter = Router();
import { userModel, courseModel } from "../../db/db";
import { signinSchema, signupSchema } from "../../schema/schema";
import jwt from "jsonwebtoken";

userRouter.post("/signup", async function (req, res) {
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
    const user = await userModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET_ADMIN || ""
    );
    //do cookies
    res.status(200).json({
      user,
      // course,
      token: token,
      message: "user and course created successfully",
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
      const errorMessages = parsedBody.error.errors
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages,
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
      process.env.JWT_SECRET_ADMIN || ""
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

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});
