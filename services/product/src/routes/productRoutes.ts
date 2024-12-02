import express from "express";
import productControllers from "../controllers/productControllers";

const router = express.Router();

// Unauthenticated routes
router.get("/id/:id", productControllers.productGet);
router.get("/all", productControllers.productGetAll);

// Authenticated routes

// Admin routes
router.post("/create", productControllers.productCreate);
router.delete("/delete/:id", productControllers.productDelete);
router.patch("/update/:id", productControllers.productUpdate);

export default router;
