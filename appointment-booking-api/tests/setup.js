
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {User} from "../src/model/user.model.js";
import {Slot} from "../src/model/slot.model.js";
import {Booking} from "../src/model/booking.model.js";

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_for_appointment_api";
  process.env.JWT_EXPIRES_IN = "1d";

  // Start an in-memory MongoDB server.
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database.
  await mongoose.connect(mongoUri);

  // Wait for all model indexes to finish building.
  await Promise.all([
    User.init(),
    Slot.init(),
    Booking.init(),
  ]);
});

beforeEach(async () => {
  // Clear all collections before each test.
  // Indexes remain intact.
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Disconnect Mongoose.
  await mongoose.disconnect();

  // Stop the in-memory MongoDB server.
  if (mongoServer) {
    await mongoServer.stop();
  }
});
