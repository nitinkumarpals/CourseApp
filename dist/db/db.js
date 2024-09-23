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
export {
  adminModel,
  courseModel,
  purchaseModel,
  userModel
};
//# sourceMappingURL=db.js.map