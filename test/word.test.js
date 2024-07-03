import { expect } from "chai";
import sinon from "sinon";
import supertest from "supertest";
import mongoose from "mongoose";
import Word from "../src/models/word.model.js";
import app from "../index.js";
import jwt from "jsonwebtoken";

const request = supertest(app);

describe("Test for Word API", () => {
  let token, userId;

  before(() => {
    userId = new mongoose.Types.ObjectId().toString();
    token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "2h" });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST /words/save", () => {
    it("should save a new word for the user", async () => {
      const mockWord = new Word({
        word: "hello",
        translation: "مرحبا",
        users: [{ userId: new mongoose.Types.ObjectId() }],
      });

      const findOneStub = sinon.stub(Word, "findOne").resolves(null);
      const saveStub = sinon.stub(Word.prototype, "save").resolves(mockWord);

      const res = await request
        .post("/words/save")
        .set("Authorization", `Bearer ${token}`)
        .send({ word: "hello", translation: "مرحبا" });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Word saved successfully");
      expect(findOneStub.calledOnce).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
    });
  });

  describe("DELETE /words/delete/:word", () => {
    it("should delete a word for the user", async () => {
      const mockWord = new Word({
        word: "hello",
        translation: "مرحبا",
        users: [{ userId }],
      });

      const findOneStub = sinon.stub(Word, "findOne").resolves(mockWord);
      const saveStub = sinon.stub(mockWord, "save").resolves(mockWord);

      const res = await request
        .delete("/words/delete/hello")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Word deleted successfully");
      expect(findOneStub.calledOnce).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
    });
  });

  describe("POST /words/test/:word", () => {
    it("should save test score for a word", async () => {
      const mockWord = new Word({
        word: "hello",
        translation: "مرحبا",
        users: [{ userId, testScores: [] }],
      });

      const findOneStub = sinon.stub(Word, "findOne").resolves(mockWord);
      const saveStub = sinon.stub(mockWord, "save").resolves(mockWord);

      const res = await request
        .post("/words/test/hello")
        .set("Authorization", `Bearer ${token}`)
        .send({ score: 90 });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "message",
        "Test score saved successfully"
      );
      expect(findOneStub.calledOnce).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
    });
  });

  describe("GET /words/my-words", () => {
    it("should get saved words for the logged-in user", async () => {
      const mockWords = [
        new Word({
          word: "hello",
          translation: "مرحبا",
          users: [{ userId }],
        }),
      ];

      const findStub = sinon.stub(Word, "find").resolves(mockWords);

      const res = await request
        .get("/words/my-words")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(1);
      expect(findStub.calledOnce).to.be.true;
    });
  });
});
