// src/routes/user/admin.ts
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
  lastName: String
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

// src/routes/user/admin.ts
import jwt2 from "jsonwebtoken";

// src/middlewares/admin.ts
import jwt from "jsonwebtoken";
var adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing or invalid");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_ADMIN || ""
    );
    if (decoded) {
      req.adminId = decoded.id;
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

// src/routes/user/admin.ts
var adminRouter = Router();
adminRouter.post("/signup", async function(req, res) {
  try {
    const body = req.body;
    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      const errorMessages = parsedBody.error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages
      });
    }
    const { email, password, firstName, lastName } = parsedBody.data;
    const admin = await adminModel.create({
      email,
      password,
      firstName,
      lastName,
      courses: []
    });
    const token = jwt2.sign(
      {
        email: admin.email,
        id: admin._id
      },
      process.env.JWT_SECRET_ADMIN || ""
    );
    res.status(200).json({
      success: true,
      admin,
      token,
      message: "Admin and course created successfully"
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
adminRouter.post("/signin", async function(req, res) {
  try {
    const body = req.body;
    const parsedBody = signinSchema.safeParse(body);
    if (!parsedBody.success) {
      const errorMessages = parsedBody.error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages
      });
    }
    const { email, password } = parsedBody.data;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    if (admin.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    const token = jwt2.sign(
      {
        email: admin.email,
        id: admin._id
      },
      process.env.JWT_SECRET_ADMIN || ""
    );
    return res.status(200).json({
      success: true,
      token: "Bearer " + token,
      message: "Signin successful",
      admin
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error"
    });
  }
});
adminRouter.post("/course", adminMiddleware, async function(req, res) {
  try {
    const adminId = req.adminId;
    const body = req.body;
    const parsedBody = courseSchema2.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + parsedBody.error.errors.map((err) => `${err.path[0]} ${err.message}`).join(", ")
      });
    }
    const { title, description, imageUrl, price } = parsedBody.data;
    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId
    });
    await adminModel.findByIdAndUpdate(adminId, {
      $push: { courses: course._id }
    });
    res.json({
      message: "Course created",
      courseId: course._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating course: ${error.message}`
    });
  }
});
adminRouter.put("/course", adminMiddleware, async function(req, res) {
  try {
    const adminId = req.adminId;
    const body = req.body;
    const parsedBody = courseSchema2.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + parsedBody.error.errors.map((err) => err.message).join(", ")
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
        message: "Course not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Error updating course: ${error.message}`
    });
  }
});
adminRouter.get(
  "/course/bulk",
  adminMiddleware,
  async function(req, res) {
    const adminId = req.adminId;
    const courses = await courseModel.find({ creatorId: adminId });
    res.status(200).json({
      success: true,
      message: "course endpoint",
      courses
    });
  }
);
export {
  adminRouter
};
//# sourceMappingURL=admin.js.map