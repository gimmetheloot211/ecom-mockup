import express from "express";
import orderControllers from "../controllers/orderControllers";

const router = express.Router();

// Authenticated routes
router.post("/", orderControllers.createOrder);
router.patch("/cancel/:id", orderControllers.cancelOrder)
router.get("/id/:id", orderControllers.getOrder);
router.get("/", orderControllers.getUserOrders);

// Admin routes
router.get("/admin/all", orderControllers.getAllOrders); 
router.get("/admin/id/:id", orderControllers.getOrderAdmin);
router.patch("/admin/id/:id", orderControllers.updateOrderStatus);
router.delete("/admin/id/:id", orderControllers.deleteOrder);



export default router;
