import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/userModel";
import UserAddress, { IUserAddress } from "../models/userAddressModel";

interface SignupRequestBody {
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

interface UserDetailsResponse {
  username: string;
  firstName: string;
  lastName: string;
  address: mongoose.Types.ObjectId | IUserAddress | null;
  admin: boolean;
}

interface UserUpdateRequestBody {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  province?: string;
  zipCode?: number;
}

const createToken = (_id: mongoose.Types.ObjectId, admin: boolean): string => {
  return jwt.sign({ _id, admin }, process.env.SECRET!, { expiresIn: "12h" });
};

const userSignup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
): Promise<void> => {
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

const userLogin = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
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
  const userID = req.user?._id;

  try {
    const user = await User.findById({ _id: userID }).populate("address");

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    const userDetails: UserDetailsResponse = {
      username: user!.username,
      firstName: user!.firstName || "",
      lastName: user!.lastName || "",
      address: user!.address || null,
      admin: user!.admin,
    };

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userUpdateDetails = async (
  req: Request<{}, {}, UserUpdateRequestBody>,
  res: Response
): Promise<void> => {
  const userID = req.user?._id;
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
        .select("-password")
        .select("-admin");
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
