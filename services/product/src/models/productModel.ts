import mongoose from "mongoose";

interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrls?: string[];
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Home", "Books", "Sports", "Fruits"],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
