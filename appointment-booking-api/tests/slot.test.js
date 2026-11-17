import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import {User} from "../src/model/user.model.js";
import {Slot} from "../src/model/slot.model.js";
import {Booking} from "../src/model/booking.model.js";

describe("Slot API", () => {
  let provider;
  let user;
  let providerToken;
  let userToken;

  // Create test accounts and generate their JWT tokens.
  beforeEach(async () => {
    provider = await User.create({
      name: "Dr. John Smith",
      email: "provider@example.com",
      password: "hashed_password",
      role: "provider",
    });

    user = await User.create({
      name: "Alex Doe",
      email: "alex@example.com",
      password: "hashed_password",
      role: "user",
    });

    providerToken = jwt.sign(
      {
        userId: provider._id.toString(),
        role: provider.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    userToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  });

  describe("POST /api/slots", () => {
    test("should allow a provider to create a valid slot", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const response = await request(app)
        .post("/api/slots")
        .set("Authorization", `Bearer ${providerToken}`)
        .send({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test("should not allow a normal user to create a slot", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const response = await request(app)
        .post("/api/slots")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      expect(response.statusCode).toBe(403);
    });

    test("should reject slot creation without authentication", async () => {
      const response = await request(app)
        .post("/api/slots")
        .send({
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 88200000).toISOString(),
        });

      expect(response.statusCode).toBe(401);
    });

    test("should reject a slot in the past", async () => {
      const startTime = new Date(Date.now() - 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const response = await request(app)
        .post("/api/slots")
        .set("Authorization", `Bearer ${providerToken}`)
        .send({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      expect(response.statusCode).toBe(400);
    });

    test("should reject a slot that is not 30 minutes long", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const response = await request(app)
        .post("/api/slots")
        .set("Authorization", `Bearer ${providerToken}`)
        .send({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });

      expect(response.statusCode).toBe(400);
    });

    test("should reject overlapping slots for the same provider", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      await Slot.create({
        provider: provider._id,
        startTime,
        endTime,
      });

      const overlappingStart = new Date(
        startTime.getTime() + 15 * 60 * 1000
      );

      const overlappingEnd = new Date(
        overlappingStart.getTime() + 30 * 60 * 1000
      );

      const response = await request(app)
        .post("/api/slots")
        .set("Authorization", `Bearer ${providerToken}`)
        .send({
          startTime: overlappingStart.toISOString(),
          endTime: overlappingEnd.toISOString(),
        });

      expect(response.statusCode).toBe(409);
    });
  });

  describe("GET /api/slots/available", () => {
    test("should return future available slots for a provider", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      await Slot.create({
        provider: provider._id,
        startTime,
        endTime,
      });

      const date = startTime.toISOString().slice(0, 10);

      const response = await request(app)
        .get("/api/slots/available")
        .query({
          providerId: provider._id.toString(),
          date,
        })
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    test("should not return slots that are already booked", async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const slot = await Slot.create({
        provider: provider._id,
        startTime,
        endTime,
      });

      await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const date = startTime.toISOString().slice(0, 10);

      const response = await request(app)
        .get("/api/slots/available")
        .query({
          providerId: provider._id.toString(),
          date,
        })
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    test("should not allow a provider to access user availability", async () => {
      const response = await request(app)
        .get("/api/slots/available")
        .query({
          providerId: provider._id.toString(),
          date: new Date(Date.now() + 86400000)
            .toISOString()
            .slice(0, 10),
        })
        .set("Authorization", `Bearer ${providerToken}`);

      expect(response.statusCode).toBe(403);
    });

    test("should reject a request with missing query parameters", async () => {
      const response = await request(app)
        .get("/api/slots/available")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
    });
  });
});
