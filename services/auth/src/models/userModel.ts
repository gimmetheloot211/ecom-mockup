import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUserAddress } from "./userAddressModel";

interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  admin: boolean;
  firstName?: string;
  lastName?: string;
  address?: mongoose.Types.ObjectId | IUserAddress;
}

interface IUserModel extends mongoose.Model<IUser> {
  signup(username: string, password: string): Promise<IUser>;
  login(username: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "UserAddress",
    },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.signup = async function (
  username: string,
  password: string
): Promise<IUser> {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const user_exists = await this.findOne({ username });

  if (user_exists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new this({ username, password: hash });

  return await user.save();
};

userSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser> {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Wrong username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Wrong password");
  }

  return user;
};

export default mongoose.model<IUser, IUserModel>("User", userSchema);
