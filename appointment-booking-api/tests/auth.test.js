import request from "supertest";
import app from "../src/app.js";

import {User} from "../src/model/user.model.js";

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Alex Doe",
          email: "alex@example.com",
          password: "Password123",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("alex@example.com");
      expect(response.body.data.role).toBe("user");
      expect(response.body.data.password).toBeUndefined();

      const user = await User.findOne({
        email: "alex@example.com",
      });

      expect(user).not.toBeNull();
      expect(user.password).not.toBe("Password123");
    });

    test("should reject duplicate email registration", async () => {
      await User.create({
        name: "Alex Doe",
        email: "alex@example.com",
        password: "hashed_password",
        role: "user",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Another Alex",
          email: "alex@example.com",
          password: "Password123",
        });

      expect(response.statusCode).toBe(409);
    });

    test("should reject invalid registration input", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "",
          email: "invalid-email",
          password: "123",
        });

      expect(response.statusCode).toBe(400);
    });

    test("should not allow public registration as provider", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Fake Provider",
          email: "provider@example.com",
          password: "Password123",
          role: "provider",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.role).toBe("user");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const bcrypt = await import("bcrypt");

      const hashedPassword = await bcrypt.hash(
        "Password123",
        10
      );

      await User.create({
        name: "Alex Doe",
        email: "alex@example.com",
        password: hashedPassword,
        role: "user",
      });
    });

    test("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "alex@example.com",
          password: "Password123",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe("alex@example.com");
      expect(response.body.data.user.role).toBe("user");
    });

    test("should reject incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "alex@example.com",
          password: "WrongPassword",
        });

      expect(response.statusCode).toBe(401);
    });

    test("should reject an unregistered email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unknown@example.com",
          password: "Password123",
        });

      expect(response.statusCode).toBe(401);
    });
  });
});