import mongoose from "mongoose";

interface ICart extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    priceTotal: number;
    stock: number;
  }[];
  cartPriceTotal: number;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceTotal: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
      },
    ],
    cartPriceTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  const total = this.items.reduce((sum, item) => sum + item.priceTotal, 0);
  this.cartPriceTotal = parseFloat(total.toFixed(2));

  next();
});

export default mongoose.model<ICart>("Cart", cartSchema);
