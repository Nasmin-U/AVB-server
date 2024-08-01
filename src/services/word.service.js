import Word from "../models/word.model.js";
import User from "../models/user.model.js"; // Import the User model

export const findWordInDatabase = async (query) => {
  const regexQuery = new RegExp(query, "i"); // Case-insensitive search

  return await Word.find({
    $or: [
      { word: regexQuery },
      { root: regexQuery },
      { skeleton: regexQuery },
      { meanings: { $elemMatch: { $regex: regexQuery } } },
    ],
  });
};

export const saveWord = async (wordId, userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const word = await Word.findById(wordId);
  if (!word) {
    throw new Error("Word not found");
  }

  if (!user.savedWords.includes(wordId)) {
    user.savedWords.push(wordId);
  }

  await user.save();
  return user;
};

export const deleteWord = async (wordId, userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.savedWords = user.savedWords.filter(
    (savedWordId) => savedWordId.toString() !== wordId
  );
  await user.save();

  return user;
};

export const saveTestScore = async (wordId, userId, score) => {
  const word = await Word.findById(wordId);
  if (!word) {
    throw new Error("Word not found");
  }

  const userWordData = word.users.find(
    (user) => user.userId.toString() === userId
  );
  if (!userWordData) {
    throw new Error("Word not saved for this user");
  }

  userWordData.testScores.push({ score });
  await word.save();

  return word;
};

export const getSavedWords = async (userId) => {
  const user = await User.findById(userId).populate("savedWords");
  if (!user) {
    throw new Error("User not found");
  }
  return user.savedWords;
};
