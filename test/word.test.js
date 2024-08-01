import { expect } from "chai";
// import sinon from "sinon";
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Word from "../src/models/word.model.js";
import { connectDb } from "../src/db/db.connection.js";
import app from "../index.js";
import jwt from "jsonwebtoken";

const request = supertest(app);

describe("Test for Word API", () => {
  let token, userId;

  before(async () => {
    await connectDb();
    userId = new mongoose.Types.ObjectId().toString();
    token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "2h" });

    await User.create({
      _id: userId,
      email: "user@example.com",
      password: "hashedPassword",
    });
  });

  afterEach(async () => {
    await Word.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /words/save", () => {
    it("should save a new word for the user", async () => {
      const mockWord = await Word.create({
        word: "hello",
        root: "hll",
        skeleton: "hll",
        wikiLink: "https://en.wiktionary.org/wiki/hello",
        meanings: ["greeting"],
      });

      const res = await request
        .post("/words/save")
        .set("Authorization", `Bearer ${token}`)
        .send({ wordId: mockWord._id.toString() });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Word saved successfully");

      const user = await User.findById(userId).populate("savedWords");
      expect(user.savedWords).to.have.lengthOf(1);
      expect(user.savedWords[0].word).to.equal("hello");
    });
  });

  describe("DELETE /words/delete/:wordId", () => {
    it("should delete a word for the user", async () => {
      const mockWord = await Word.create({
        word: "hello",
        root: "hll",
        skeleton: "hll",
        wikiLink: "https://en.wiktionary.org/wiki/hello",
        meanings: ["greeting"],
      });

      await User.findByIdAndUpdate(userId, {
        $push: { savedWords: mockWord._id },
      });

      const res = await request
        .delete(`/words/delete/${mockWord._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Word deleted successfully");

      const user = await User.findById(userId).populate("savedWords");
      expect(user.savedWords).to.have.lengthOf(0);
    });
  });

  // Uncomment and fix the following test if the functionality is ready
  // describe("POST /words/test/:wordId", () => {
  //   it("should save test score for a word", async () => {
  //     const mockWord = await Word.create({
  //       word: "hello",
  //       root: "hll",
  //       skeleton: "hll",
  //       wikiLink: "https://en.wiktionary.org/wiki/hello",
  //       meanings: ["greeting"],
  //     });

  //     await User.findByIdAndUpdate(userId, {
  //       $push: { savedWords: mockWord._id },
  //     });

  //     const res = await request
  //       .post(`/words/test/${mockWord._id}`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ score: 90 });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property(
  //       "message",
  //       "Test score saved successfully"
  //     );

  //     const updatedWord = await Word.findById(mockWord._id);
  //     const userScore = updatedWord.users.find(
  //       (u) => u.userId.toString() === userId
  //     );
  //     expect(userScore).to.not.be.undefined;
  //     expect(userScore.testScores).to.have.lengthOf(1);
  //     expect(userScore.testScores[0].score).to.equal(90);
  //   });
  // });

  describe("GET /words/my-words", () => {
    it("should get saved words for the logged-in user", async () => {
      const mockWord = await Word.create({
        word: "hello",
        root: "hll",
        skeleton: "hll",
        wikiLink: "https://en.wiktionary.org/wiki/hello",
        meanings: ["greeting"],
      });

      await User.findByIdAndUpdate(userId, {
        $push: { savedWords: mockWord._id },
      });

      const res = await request
        .get("/words/my-words")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].word).to.equal("hello");
    });
  });
});
