import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import { hashPassword } from "../src/db/helper.js";
import { connectDb } from "../src/db/db.connection.js";
import app from "../index.js";
import bcrypt from "bcryptjs";

const request = supertest(app);

describe("Tests for User", () => {
  before(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe("POST /users/signup", () => {
    it("should sign up a new user successfully", async () => {
      const res = await request.post("/users/signup").send({
        email: "newUser@email.com",
        password: "PassWord1234!",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Sign Up successful");
      expect(res.body).to.have.property("userId");

      const user = await User.findOne({ email: "newUser@email.com" });
      expect(user).to.not.be.null;
      expect(user.email).to.equal("newUser@email.com");
    });

    it("should fail to sign up a user with an existing email", async () => {
      const hashedPassword = await hashPassword("PassWord1234!");
      await User.create({
        email: "newUser@email.com",
        password: hashedPassword,
      });

      const res = await request.post("/users/signup").send({
        email: "newUser@email.com",
        password: "PassWord1234!",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Email already exists");
    });

    it("should fail to sign up a user with invalid email", async () => {
      const res = await request.post("/users/signup").send({
        email: "invalidEmail",
        password: "PassWord1234!",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
      expect(res.body.errors[0]).to.have.property(
        "msg",
        "Please enter a valid email address"
      );
    });

    it("should not let user sign up with weak password", async () => {
      const res = await request.post("/users/signup").send({
        email: "newUser@email.com",
        password: "pass",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("errors");
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
      expect(res.body.errors[0])
        .to.have.property("msg")
        .that.includes("Password must");
    });
  });

  describe("POST /users/login", () => {
    it("should login a user successfully", async () => {
      const hashedPassword = await hashPassword("PassWord1234!");
      await User.create({
        email: "newUser@email.com",
        password: hashedPassword,
      });

      const res = await request.post("/users/login").send({
        email: "newUser@email.com",
        password: "PassWord1234!",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Login successful");
      expect(res.body).to.have.property("token");
    });

    it("should fail to login with incorrect password", async () => {
      const hashedPassword = await hashPassword("PassWord1234!");
      await User.create({
        email: "newUser@email.com",
        password: hashedPassword,
      });

      const res = await request.post("/users/login").send({
        email: "newUser@email.com",
        password: "wrongPassword",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Invalid login details");
    });

    it("should fail to login with non-existing email", async () => {
      const res = await request.post("/users/login").send({
        email: "nonExistentUser@email.com",
        password: "PassWord1234!",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Invalid login details");
    });
  });

  describe("POST /users/change-password", () => {
    it("should change the password successfully", async () => {
      const hashedPassword = await hashPassword("OldPassWord123!");
      const user = await User.create({
        email: "user@email.com",
        password: hashedPassword,
      });

      const loginRes = await request.post("/users/login").send({
        email: "user@email.com",
        password: "OldPassWord123!",
      });

      const token = loginRes.body.token;

      const res = await request
        .post("/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "OldPassWord123!",
          newPassword: "NewPassWord123!",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Password changed");

      const updatedUser = await User.findById(user._id);
      const result = await bcrypt.compare(
        "NewPassWord123!",
        updatedUser.password
      );
      expect(result).to.be.true;
    });

    it("should fail to change the password with incorrect old password", async () => {
      const hashedPassword = await hashPassword("OldPassWord123!");
      await User.create({
        email: "user@email.com",
        password: hashedPassword,
      });

      const loginRes = await request.post("/users/login").send({
        email: "user@email.com",
        password: "OldPassWord123!",
      });

      const token = loginRes.body.token;

      const res = await request
        .post("/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "WrongOldPassWord",
          newPassword: "NewPassWord123!",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Old password is incorrect");
    });

    it("should fail to change the password if not authenticated", async () => {
      const res = await request.post("/users/change-password").send({
        oldPassword: "OldPassWord123!",
        newPassword: "NewPassWord123!",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property(
        "message",
        "Access denied, no token provided"
      );
    });
  });
});
