import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
  },
  root: {
    type: String,
    default: "",
  },
  skeleton: {
    type: String,
    default: "",
  },
  wikiLink: {
    type: String,
    default: "",
  },
  meanings: {
    type: [String],
    default: [],
  },
  pronunciation: {
    type: String,
    default: "",
  },
  audioFile: {
    type: String,
    default: "",
  },
});

const Word = mongoose.model("Word", wordSchema);
export default Word;
