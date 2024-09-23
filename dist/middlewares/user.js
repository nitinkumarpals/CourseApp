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
export {
  userMiddleware
};
//# sourceMappingURL=user.js.map