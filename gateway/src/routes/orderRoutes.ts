import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";

import requireAuth from "../middleware/authMiddleware";
import requireAdmin from "../middleware/adminMiddleware";

dotenv.config();

const router = express.Router();
const ORDER_PORT = 8003;

const orderServiceProxy: RequestHandler = createProxyMiddleware({
  target: `http://order:${ORDER_PORT}`,
  changeOrigin: true,
  timeout: 10000,
  proxyTimeout: 10000,
});

// Order routes
router.post("/", requireAuth, orderServiceProxy);
router.patch("/cancel/:id", requireAuth, orderServiceProxy);
router.get("/id/:id", requireAuth, orderServiceProxy);
router.get("/", requireAuth, orderServiceProxy);

// Cart routes
router.get("/cart", requireAuth, orderServiceProxy);
router.patch("/cart/clear", requireAuth, orderServiceProxy);
router.patch("/cart/item/update", requireAuth, orderServiceProxy);
router.patch("/cart/item/remove", requireAuth, orderServiceProxy);

// Admin routes
router.get("/admin/all", requireAuth, requireAdmin, orderServiceProxy);
router.get("/admin/id/:id", requireAuth, requireAdmin, orderServiceProxy);
router.patch("/admin/id/:id", requireAuth, requireAdmin, orderServiceProxy);
router.delete("/admin/id/:id", requireAuth, requireAdmin, orderServiceProxy);

// router.use((req, res, next) => {
//   console.log(`[DEBUG] Incoming request path: ${req.path}`);
//   next();
// });

export default router;
