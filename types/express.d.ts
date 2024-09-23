// express.d.ts
import { Request as ExpressRequest } from "express";

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      userId?: string;
    }
  }
}
