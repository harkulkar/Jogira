import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb";
import { User } from "../src/models/User";
import { Trek } from "../src/models/Trek";
import { SEED_TREKS } from "../src/lib/seed-data";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@jogira.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log("Admin already exists");
  }

  for (const trek of SEED_TREKS) {
    const exists = await Trek.findOne({ slug: trek.slug });
    if (!exists) {
      const { _id, ...trekData } = trek;
      await Trek.create(trekData);
      console.log(`Trek seeded: ${trek.title}`);
    }
  }

  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
