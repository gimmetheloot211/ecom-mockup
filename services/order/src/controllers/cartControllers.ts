import mongoose from "mongoose";
import axios from "axios";
import { Request, Response } from "express";

import Cart from "../models/cartModel";

interface UpdateCartBody {
  productID: mongoose.Types.ObjectId;
  quantity: number;
}

interface RemoveCartItemBody {
  productID: mongoose.Types.ObjectId;
}

const updateCartItem = async (
  req: Request<{}, {}, UpdateCartBody>,
  res: Response
): Promise<void> => {
  const userID = req.headers["x-user-id"];
  const { productID, quantity } = req.body;

  const nQuantity = Number(quantity);

  // Validate productID
  if (!mongoose.Types.ObjectId.isValid(productID)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  // Validate quantity
  if (isNaN(nQuantity) || !Number.isInteger(nQuantity) || nQuantity === 0) {
    res.status(400).json({
      error: "Quantity must be a non-zero integer.",
    });
    return;
  }

  try {
    // Fetch product details
    const productResponse = await axios.get(
      `http://gateway:8000/product/id/${productID}`
    );

    if (productResponse.status !== 200) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const {
      price: productPrice,
      name: productName,
      stock: productStock,
    } = productResponse.data;

    let cart = await Cart.findOne({ user: userID });

    if (!cart) {
      cart = new Cart({ user: userID, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productID.toString()
    );

    // Check stock availability
    if (itemIndex > -1) {
      const currentQuantity = cart.items[itemIndex].quantity;
      const newQuantity = currentQuantity + nQuantity;

      if (newQuantity > productStock) {
        res.status(400).json({
          error: `Only ${productStock} of ${productName} are in stock.`,
        });
        return;
      }

      // Update or remove item based on quantity
      if (newQuantity <= 0) {
        cart.items.splice(itemIndex, 1); // Remove item if quantity is zero or negative
      } else {
        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].priceTotal = parseFloat(
          (productPrice * newQuantity).toFixed(2)
        );
      }
    } else {
      if (nQuantity > productStock) {
        res.status(400).json({
          error: `Only ${productStock} of ${productName} are in stock.`,
        });
        return;
      }

      // Add new item
      cart.items.push({
        product: productID,
        productName: productName,
        quantity: nQuantity,
        priceTotal: parseFloat((productPrice * nQuantity).toFixed(2)),
        stock: productStock,
      });
    }

    // Save updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req: Request, res: Response): Promise<void> => {
  const userID = req.headers["x-user-id"];

  try {
    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve cart", details: error.message });
  }
};

const clearCart = async (req: Request, res: Response): Promise<void> => {
  const userID = req.headers["x-user-id"];

  try {
    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    cart.items = [];

    await cart.save();

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeCartItem = async (
  req: Request<{}, {}, RemoveCartItemBody>,
  res: Response
): Promise<void> => {
  const userID = req.headers["x-user-id"];
  const { productID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  try {
    const cart = await Cart.findOne({ user: userID });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productID.toString()
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
    } else {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cartControllers = {
  updateCartItem,
  getCart,
  clearCart,
  removeCartItem,
};

export default cartControllers;
