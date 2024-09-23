// src/routes/course/course.ts
import express from "express";
var courseRouter = express.Router();
courseRouter.post("/purchase", function(req, res) {
  res.json({
    message: "signup endpoint"
  });
});
courseRouter.get("/", function(req, res) {
  res.json({
    message: "course endpoint"
  });
});
export {
  courseRouter
};
//# sourceMappingURL=course.js.map