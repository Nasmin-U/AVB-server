import {
  findWordInDatabase,
  saveWord,
  deleteWord,
  saveTestScore,
  getSavedWords,
} from "../services/word.service.js";
import Word from "../models/word.model.js";

export const searchWordController = async (req, res) => {
  const { word } = req.query;

  try {
    const words = await findWordInDatabase(word);

    if (!words.length) {
      return res
        .status(404)
        .json({ message: "Word not found in the database" });
    }

    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveWordController = async (req, res) => {
  const { wordId } = req.body;
  const userId = req.user.userId;

  try {
    await saveWord(wordId, userId);
    res.status(201).json({ message: "Word saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteWordController = async (req, res) => {
  const { wordId } = req.params;
  const userId = req.user.userId;

  try {
    await deleteWord(wordId, userId);
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveTestScoreController = async (req, res) => {
  const { wordId } = req.params;
  const { score } = req.body;
  const userId = req.user.userId;

  try {
    await saveTestScore(wordId, userId, score);
    res.json({ message: "Test score saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSavedWordsController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const words = await getSavedWords(userId);
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRandomWordsController = async (req, res) => {
  const count = parseInt(req.query.count) || 5;
  try {
    const randomWords = await Word.aggregate([{ $sample: { size: count } }]);
    res.json(randomWords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
