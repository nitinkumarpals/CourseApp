import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
interface RequestWithUserId extends Request {
  userId: string;
}
const middleware = async (
  req: RequestWithUserId,
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
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      throw new Error("Invalid token payload or jwt secret");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized",
    });
  }
};
