import express from "express";
import {
  signUpController,
  loginController,
  changePasswordController,
} from "../controllers/user.controller.js";
import {
  signUpValidation,
  loginValidation,
  passwordValidation,
} from "../middlewares/users.validation.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.post("/signup", signUpValidation, signUpController);
router.post("/login", loginValidation, loginController);
router.post(
  "/change-password",
  verifyToken,
  passwordValidation,
  changePasswordController
);

export default router;
