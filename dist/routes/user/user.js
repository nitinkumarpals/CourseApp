// src/routes/user/user.ts
import { Router } from "express";

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

// src/schema/schema.ts
import { z } from "zod";
var signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});
var signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
var courseSchema2 = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string().optional(),
  creatorId: z.string().optional(),
  courseId: z.string().optional()
});

// src/routes/user/user.ts
import jwt2 from "jsonwebtoken";

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

// src/routes/user/user.ts
var userRouter = Router();
userRouter.post("/signup", async function(req, res) {
  try {
    const body = req.body;
    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`).join(", ")
      });
    }
    const { email, password, firstName, lastName } = parsedBody.data;
    const user = await userModel.create({
      email,
      password,
      firstName,
      lastName,
      courses: []
    });
    const token = jwt2.sign(
      {
        email: user.email,
        id: user._id
      },
      process.env.JWT_SECRET || ""
    );
    res.status(200).json({
      user,
      token,
      message: "user created successfully"
    });
  } catch (error) {
    if (error instanceof Error && error.code === 11e3) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
        message: "Email already in use"
      });
    } else {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server error"
      });
    }
  }
});
userRouter.post("/signin", async function(req, res) {
  try {
    const body = req.body;
    const parsedBody = signinSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`).join(", ")
      });
    }
    const { email, password } = parsedBody.data;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    const token = jwt2.sign(
      {
        email: user.email,
        id: user._id
      },
      process.env.JWT_SECRET || ""
    );
    return res.status(200).json({
      success: true,
      token,
      message: "Signin successful",
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error"
    });
  }
});
userRouter.get("/purchases", userMiddleware, async function(req, res) {
  try {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId });
    const courseIds = purchases.map((purchase) => purchase.courseId);
    const courses = await courseModel.find({ _id: { $in: courseIds } });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({
      message: "Error getting purchases",
      error: error.message
    });
  }
});
export {
  userRouter
};
//# sourceMappingURL=user.js.map