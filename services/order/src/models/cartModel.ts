import mongoose from "mongoose";

interface ICart extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  items: {
    product: mongoose.Schema.Types.ObjectId;
    productName: string;
    quantity: number;
    priceTotal: number;
    stock: number;
  }[];
  cartPriceTotal: number;
  createdAt: Date;
  updatedAt: Date;
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
        priceTotal: { type: Number, required: true },
        stock: { type: Number, required: true},
      },
    ],
    cartPriceTotal: {
      type: Number,
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
