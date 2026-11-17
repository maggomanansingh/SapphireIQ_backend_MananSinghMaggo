import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import {User} from "../src/model/user.model.js";
import {Slot} from "../src/model/slot.model.js";
import {Booking} from "../src/model/booking.model.js";

describe("Booking API", () => {
  let provider;
  let user;
  let anotherUser;
  let providerToken;
  let userToken;
  let anotherUserToken;

  let slot;

  // Create test accounts and authentication tokens.
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

    anotherUser = await User.create({
      name: "Sam Doe",
      email: "sam@example.com",
      password: "hashed_password",
      role: "user",
    });

    const generateToken = (account) =>
      jwt.sign(
        {
          userId: account._id.toString(),
          role: account.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

    providerToken = generateToken(provider);
    userToken = generateToken(user);
    anotherUserToken = generateToken(anotherUser);

    // Create a future appointment slot.
    const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    slot = await Slot.create({
      provider: provider._id,
      startTime,
      endTime,
    });
  });

  describe("POST /api/bookings", () => {
    test("should allow a user to book an available slot", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      const booking = await Booking.findOne({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      expect(booking).not.toBeNull();
    });

    test("should not allow a provider to book a slot", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${providerToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      expect(response.statusCode).toBe(403);
    });

    test("should reject booking without authentication", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .send({
          slotId: slot._id.toString(),
        });

      expect(response.statusCode).toBe(401);
    });

    test("should reject booking with an invalid slot ID", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: "invalid-slot-id",
        });

      expect(response.statusCode).toBe(400);
    });

    test("should reject booking for a slot that does not exist", async () => {
      const nonExistingSlotId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: nonExistingSlotId,
        });

      expect(response.statusCode).toBe(404);
    });

    test("should reject booking for a past slot", async () => {
      const pastStart = new Date(Date.now() - 60 * 60 * 1000);
      const pastEnd = new Date(
        pastStart.getTime() + 30 * 60 * 1000
      );

      const pastSlot = await Slot.create({
        provider: provider._id,
        startTime: pastStart,
        endTime: pastEnd,
      });

      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: pastSlot._id.toString(),
        });

      expect(response.statusCode).toBe(400);
    });

    test("should prevent two users from booking the same slot", async () => {
      const firstResponse = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      const secondResponse = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      expect(firstResponse.statusCode).toBe(201);
      expect(secondResponse.statusCode).toBe(409);
    });

    test("should prevent a user from having two active bookings", async () => {
      const firstResponse = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      expect(firstResponse.statusCode).toBe(201);

      const secondStart = new Date(
        slot.startTime.getTime() + 60 * 60 * 1000
      );

      const secondSlot = await Slot.create({
        provider: provider._id,
        startTime: secondStart,
        endTime: new Date(secondStart.getTime() + 30 * 60 * 1000),
      });

      const secondResponse = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          slotId: secondSlot._id.toString(),
        });

      expect(secondResponse.statusCode).toBe(409);
    });
  });

  describe("GET /api/bookings/my-bookings", () => {
    test("should return the logged-in user's bookings", async () => {
      await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const response = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    test("should not allow a provider to access user booking history", async () => {
      const response = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${providerToken}`);

      expect(response.statusCode).toBe(403);
    });
  });

  describe("GET /api/bookings", () => {
    test("should allow a provider to view bookings for their slots", async () => {
      await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const response = await request(app)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${providerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    test("should not allow a normal user to access provider bookings", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(403);
    });
  });

  describe("PATCH /api/bookings/:id/cancel", () => {
    test("should allow a user to cancel their booking", async () => {
      const booking = await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedBooking = await Booking.findById(booking._id);

      expect(updatedBooking.status).toBe("cancelled");
    });

    test("should reject cancellation by another user", async () => {
      const booking = await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${anotherUserToken}`);

      expect(response.statusCode).toBe(404);
    });

    test("should reject cancellation of an already cancelled booking", async () => {
      const booking = await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "cancelled",
      });

      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(409);
    });

    test("should reject cancellation with an invalid booking ID", async () => {
      const response = await request(app)
        .patch("/api/bookings/invalid-id/cancel")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
    });

    test("should make the cancelled slot available again", async () => {
      const booking = await Booking.create({
        user: user._id,
        slot: slot._id,
        status: "confirmed",
      });

      const cancelResponse = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(cancelResponse.statusCode).toBe(200);

      // Another user should now be able to book the same slot.
      const newBookingResponse = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          slotId: slot._id.toString(),
        });

      expect(newBookingResponse.statusCode).toBe(201);
    });
  });
});
