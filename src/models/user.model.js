import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Error: Invalid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
