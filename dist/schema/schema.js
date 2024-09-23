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
var courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string().optional(),
  creatorId: z.string().optional(),
  courseId: z.string().optional()
});
export {
  courseSchema,
  signinSchema,
  signupSchema
};
//# sourceMappingURL=schema.js.map