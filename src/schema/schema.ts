import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string().optional(),
  creatorId: z.string().optional(),
  courseId: z.string().optional(),
});