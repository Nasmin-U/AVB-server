import {
  signUpUser,
  loginUser,
  changePassword,
} from "../services/user.service.js";

export const signUpController = async (req, res) => {
  try {
    const userId = await signUpUser(req.body);
    res.status(201).json({ message: "Sign Up successful", userId });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    if (error.message === "Invalid login details") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    await changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    if (error.message === "Old password is incorrect") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
