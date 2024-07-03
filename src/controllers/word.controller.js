import {
  findWordInDatabase,
  fetchWiktionaryData,
  parseWiktionaryData,
  updateWordInDatabase,
  saveWord,
  deleteWord,
  saveTestScore,
  getSavedWords,
} from "../services/word.service.js";
import Word from "../models/word.model.js"; 
export const searchWordController = async (req, res) => {
  const { word } = req.query;

  try {
    let wordData = await findWordInDatabase(word);

    if (!wordData) {
      return res
        .status(404)
        .json({ message: "Word not found in the database" });
    }

    const { translation } = wordData;

    try {
      const html = await fetchWiktionaryData(translation);
      const parsedData = parseWiktionaryData(html);

      wordData = await updateWordInDatabase(word, parsedData);

      res.json({
        word: wordData.word,
        translation: wordData.translation,
        pronunciation: wordData.pronunciation,
        audioFile: wordData.audioFile,
        root: wordData.root,
        definition: wordData.definition,
        definitionHTML: wordData.definitionHTML,
      });
    } catch (error) {
      if (error.message === "Translation not found on Wiktionary") {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveWordController = async (req, res) => {
  const { word, translation } = req.body;
  const userId = req.user.userId;

  try {
    await saveWord(word, translation, userId);
    res.status(201).json({ message: "Word saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteWordController = async (req, res) => {
  const { word } = req.params;
  const userId = req.user.userId;

  try {
    await deleteWord(word, userId);
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveTestScoreController = async (req, res) => {
  const { word } = req.params;
  const { score } = req.body;
  const userId = req.user.userId;

  try {
    await saveTestScore(word, userId, score);
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