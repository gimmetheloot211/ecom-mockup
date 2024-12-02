import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import UserAddress from "../models/userAddressModel";

dotenv.config();

const createAdminUser = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_USERNAME ) {
      console.error(
        "Environment variables for database URI or admin credentials are missing."
      );
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI!);

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin";
    const existingAdmin = await User.findOne({ username });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      username: username,
      password: hashedPassword,
      admin: true,
    });

    
    const userAddress = await UserAddress.create({
      user: adminUser._id,
    });
    
    adminUser.address = userAddress._id;

    await adminUser.save();

    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
