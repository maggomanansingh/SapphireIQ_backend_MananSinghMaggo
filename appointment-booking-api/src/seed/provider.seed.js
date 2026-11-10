import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import {User} from "../model/user.model.js";

const seedProviders = async () => {
  try {
    await connectDB();

    const providers = [
      {
        name: process.env.PROVIDER_1_NAME,
        email: process.env.PROVIDER_1_EMAIL,
        password: process.env.PROVIDER_1_PASSWORD,
      },
      {
        name: process.env.PROVIDER_2_NAME,
        email: process.env.PROVIDER_2_EMAIL,
        password: process.env.PROVIDER_2_PASSWORD,
      },
      {
        name: process.env.PROVIDER_3_NAME,
        email: process.env.PROVIDER_3_EMAIL,
        password: process.env.PROVIDER_3_PASSWORD,
      },
    ];

    for (const provider of providers) {
      if (!provider.name || !provider.email || !provider.password) {
        throw new Error("Provider seed environment variables are missing");
      }

      const normalizedEmail = provider.email.trim().toLowerCase();

      const existingProvider = await User.findOne({
        email: normalizedEmail,
      });

      if (existingProvider) {
        console.log(`Provider already exists: ${normalizedEmail}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(provider.password, 10);

      await User.create({
        name: provider.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "provider",
      });

      console.log(`Provider created: ${normalizedEmail}`);
    }

    console.log("Provider seeding completed successfully");
  } catch (error) {
    console.error("Provider seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProviders();
