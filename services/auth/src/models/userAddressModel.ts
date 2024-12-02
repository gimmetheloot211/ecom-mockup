import mongoose from "mongoose";

export interface IUserAddress extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  province: string;
  city: string;
  street: string;
  zipCode: number;
}

const userAddressSchema = new mongoose.Schema<IUserAddress>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  province: {
    type: String,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  zipCode: {
    type: Number,
  },
});

export default mongoose.model<IUserAddress>("UserAddress", userAddressSchema);
