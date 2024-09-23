import express from "express";
export const courseRouter = express.Router();
courseRouter.post("/purchase", function (req, res) {
  // you would expect the user to pay you money
  res.json({
    message: "signup endpoint",
  });
});

courseRouter.get("/", function (req, res) {
  res.json({
    message: "course endpoint",
  });
});
