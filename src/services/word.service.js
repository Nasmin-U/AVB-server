import axios from "axios";
import Word from "../models/word.model.js";
import { load } from "cheerio";

export const findWordInDatabase = async (word) => {
  return await Word.findOne({
    $or: [
      { word: { $regex: new RegExp(`^${word}$`, "i") } },
      { translation: word },
    ],
  });
};

export const fetchWiktionaryData = async (translation) => {
  try {
    const response = await axios.get(
      `https://en.wiktionary.org/wiki/${encodeURIComponent(translation)}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Translation not found on Wiktionary");
    }
    throw error;
  }
};

export const parseWiktionaryData = (html) => {
  const $ = load(html);

  const pronunciation = $("span.IPA").first().text().trim();
  const audioFile = $("audio > source").attr("src");

  const rootElement = $("table.wikitable span.Arab a").first();
  const root = rootElement.text().trim();

  const definitionDiv = $("p:has(span.headword-line)").first();
  const definitionHTML = definitionDiv.html();
  const definitionText = definitionDiv.text().trim();

  return {
    pronunciation,
    audioFile,
    root,
    definitionText,
    definitionHTML,
  };
};

export const updateWordInDatabase = async (word, data) => {
  return await Word.findOneAndUpdate(
    {
      $or: [
        { word: { $regex: new RegExp(`^${word}$`, "i") } },
        { translation: word },
      ],
    },
    data,
    { new: true }
  );
};

export const saveWord = async (word, translation, userId) => {
  let wordData = await Word.findOne({ word });

  if (!wordData) {
    wordData = new Word({ word, translation });
  }

  if (!wordData.users.some((user) => user.userId.toString() === userId)) {
    wordData.users.push({ userId });
  }

  await wordData.save();
  return wordData;
};

export const deleteWord = async (word, userId) => {
  const wordData = await Word.findOne({ word });

  if (!wordData) {
    throw new Error("Word not found");
  }

  wordData.users = wordData.users.filter(
    (user) => user.userId.toString() !== userId
  );
  await wordData.save();

  return wordData;
};

export const saveTestScore = async (word, userId, score) => {
  const wordData = await Word.findOne({ word });

  if (!wordData) {
    throw new Error("Word not found");
  }

  const user = wordData.users.find((user) => user.userId.toString() === userId);
  if (!user) {
    throw new Error("Word not saved for this user");
  }

  user.testScores.push({ score });
  await wordData.save();

  return wordData;
};

export const getSavedWords = async (userId) => {
  const words = await Word.find({ "users.userId": userId });
  return words || [];
};