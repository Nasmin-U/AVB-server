import express from "express";
import { searchWordController } from "../controllers/word.controller.js";
import {
  saveWordController,
  deleteWordController,
  saveTestScoreController,
  getSavedWordsController,
  getRandomWordsController
} from "../controllers/word.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/search", searchWordController);
router.post("/save", verifyToken, saveWordController);
router.delete("/delete/:word", verifyToken, deleteWordController);
router.post("/test/:word", verifyToken, saveTestScoreController);
router.get("/my-words", verifyToken, getSavedWordsController);
router.get("/random-words", getRandomWordsController); 

export default router;
