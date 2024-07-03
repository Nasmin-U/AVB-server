import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../db/helper.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

export const signUpUser = async ({ email, password }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return newUser._id;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login details");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login details");
    }
    const token = jwt.sign({ userId: user._id }, SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    user.password = await hashPassword(newPassword);
    await user.save();
  } catch (error) {
    throw error;
  }
};
