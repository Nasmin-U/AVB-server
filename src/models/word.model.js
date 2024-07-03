import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
  },
  translation: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    default: "",
  },
  audioFile: {
    type: String,
    default: "",
  },
  root: {
    type: String,
    default: "",
  },
  definition: {
    type: String,
    default: "",
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      testScores: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          score: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

const Word = mongoose.model("Word", wordSchema);
export default Word;
