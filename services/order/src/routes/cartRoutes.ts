import express from "express";
import cartControllers from "../controllers/cartControllers";

const router = express.Router();

// Authenticated routes
router.get("/", cartControllers.getCart);
router.patch("/clear", cartControllers.clearCart);
router.patch("/item/update", cartControllers.updateCartItem);
router.patch("/item/remove", cartControllers.removeCartItem);

export default router;
