import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing or invalid");
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_ADMIN || ""
    ) as JwtPayload;

    if (decoded) {
      req.adminId = decoded.id;
      next();
    } 
    else{
      throw new Error("Invalid token payload or jwt secret");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized",
    });
  }
};
