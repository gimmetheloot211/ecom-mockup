import mongoose from "mongoose";
import { Request, Response } from "express";

import Cart from "../models/cartModel";
import Order from "../models/orderModel";

interface CreateOrderBody {
  cartID: mongoose.Types.ObjectId;
}

interface UpdateOrderStatusBody {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "canceled";
}
const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response
): Promise<void> => {
  const userID = req.user?._id;
  const { cartID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cartID)) {
    res.status(400).json({ error: "Invalid cart ID" });
    return;
  }

  try {
    const cart = await Cart.findById(cartID);
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }
    if (cart.items.length === 0) {
      res
        .status(400)
        .json({ error: "Cannot place an order with an empty cart" });
      return;
    }

    const order = await Order.create({
      user: userID,
      items: cart.items,
      totalAmount: cart.cartPriceTotal,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const userID = req.user?._id;
  const orderID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  try {
    const order = await Order.findOne({ user: userID, _id: orderID }).populate(
      "cart"
    );

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.status === "shipped" || order.status === "delivered") {
      res
        .status(400)
        .json({ error: "Cannot cancel a shipped or delivered order" });
      return;
    }

    order.status = "canceled";
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req: Request, res: Response): Promise<void> => {
  const userID = req.user?._id;
  const orderID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  try {
    const order = await Order.findOne({ _id: orderID, user: userID });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  const userID = req.user?._id;

  try {
    const orders = await Order.find({ user: userID }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//for admin users
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderAdmin = async (req: Request, res: Response): Promise<void> => {
  const orderID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    res.status(400).json({ error: "Invalid Order ID" });
    return;
  }

  try {
    const order = await Order.findById(orderID);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (
  req: Request<{ id: string }, {}, UpdateOrderStatusBody>,
  res: Response
): Promise<void> => {
  const orderID = req.params.id;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    res.status(400).json({ error: "Invalid Order ID" });
    return;
  }

  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "canceled",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderID,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const orderID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    res.status(400).json({ error: "Invalid Order ID" });
    return;
  }

  try {
    const order = await Order.findByIdAndDelete(orderID);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const orderControllers = {
  createOrder,
  cancelOrder,
  getOrder,
  getUserOrders,

  //admin controllers
  getAllOrders,
  getOrderAdmin,
  updateOrderStatus,
  deleteOrder,
};

export default orderControllers;
