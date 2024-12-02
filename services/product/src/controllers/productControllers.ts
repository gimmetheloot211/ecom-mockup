import mongoose from "mongoose";
import { Request, Response } from "express";
import Product from "../models/productModel";

interface ProductCreateBody {
  name: string;
  description: string; 
  price: number; 
  stock: number; 
  category: "Electronics" | "Clothing" | "Home" | "Books" | "Sports" | "Fruits";
}

const productGet = async (req: Request, res: Response): Promise<void> => {
  const productID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  try {
    const product = await Product.findById(productID);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productGetAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productCreate = async (req: Request<{}, {}, ProductCreateBody>, res: Response): Promise<void> => {
  const { name, description, price, stock, category } = req.body;

  if (!name || !description || !price || !stock || !category) {
    res.status(400).json({ error: "Please fill in all the fields" });
    return;
  }

  try {
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const productDelete = async (req: Request, res: Response): Promise<void> => {
  const productID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  try {
    const product = await Product.findByIdAndDelete(productID);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productUpdate = async (req: Request, res: Response): Promise<void> => {
  const productID = req.params.id;
  const { ...fieldsToUpdate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productID)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const allowedUpdates = [
    "name",
    "description",
    "price",
    "stock",
    "category",
    "imageUrls",
  ];
  const updates = Object.keys(fieldsToUpdate);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).json({ error: "Invalid fields in update" });
    return;
  }
  try {
    const product = await Product.findByIdAndUpdate(
      productID,
      {
        ...fieldsToUpdate,
      },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const productControllers = {
  productCreate,
  productGet,
  productGetAll,
  productDelete,
  productUpdate,
};

export default productControllers;
