import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/userModel";
import UserAddress from "../models/userAddressModel";

const createToken = (_id: mongoose.Types.ObjectId, admin: boolean) => {
  return jwt.sign({ _id, admin }, process.env.SECRET!, { expiresIn: "12h" });
};

const userSignup = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.signup(username, password);
    await UserAddress.create({
      user: user._id,
    });
    const token = createToken(user._id, user.admin);

    res.status(201).json({ username, token, admin: user.admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id, user.admin);

    res.status(200).json({ username, token, admin: user.admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userGetDetails = async (req: Request, res: Response): Promise<void> => {
  const userID = req.headers["x-user-id"];

  try {
    const user = await User.findById({ _id: userID }).populate("address");

    const userDetails = {
      username: user?.username,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      address: user?.address || "",
      admin: user?.admin,
    };
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userUpdateDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userID = req.headers["x-user-id"];
  const { firstName, lastName, street, city, province, zipCode } = req.body;

  try {
    if (street || city || province || zipCode) {
      const userAddress = await UserAddress.findOneAndUpdate(
        { user: userID },
        { street, city, province, zipCode, user: userID },
        { upsert: true, new: true }
      );
    }

    let user = null;

    if (firstName || lastName) {
      const updatedFields: Record<string, string | undefined> = {};

      if (firstName) updatedFields.firstName = firstName;
      if (lastName) updatedFields.lastName = lastName;

      user = await User.findByIdAndUpdate(userID, updatedFields, { new: true })
        .populate("address")
        .select("-password")
        .select("-admin");
    } else {
      user = await User.findById(userID)
        .populate("address")
        .select("-password");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userGetDetailsAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    res.status(400).json({ error: "Invalid user ID format" });
    return;
  }

  try {
    const user = await User.findById(userID)
      .populate("address")
      .select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userControllers = {
  userSignup,
  userLogin,
  userGetDetails,
  userUpdateDetails,
  userGetDetailsAdmin,
};

export default userControllers;
