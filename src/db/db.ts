import mongoose, { Types } from "mongoose";
const ObjectId = Types.ObjectId;
import dotenv from "dotenv";
dotenv.config();
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}
mongoose.connect(process.env.MONGODB_URI);
import { Schema } from "mongoose";
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  courses: [ObjectId],
});

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  courses: [ObjectId],
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

export const userModel = mongoose.model("User", userSchema);
export const adminModel = mongoose.model("Admin", adminSchema);
export const courseModel = mongoose.model("Course", courseSchema);
export const purchaseModel = mongoose.model("Purchase", purchaseSchema);
