import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";

import requireAuth from "../middleware/authMiddleware";
import requireAdmin from "../middleware/adminMiddleware";

dotenv.config();

const router = express.Router();
const PRODUCT_PORT = 8002;

const productServiceProxy: RequestHandler = createProxyMiddleware({
  target: `http://product:${PRODUCT_PORT}`,
  changeOrigin: true,
  timeout: 10000,
  proxyTimeout: 10000,
});

// Unauthenticated routes
router.get("/id/:id", productServiceProxy);
router.get("/all", productServiceProxy);

// Authenticated Routes

// Admin routes
router.post("/create", requireAuth, requireAdmin, productServiceProxy);
router.delete("/delete/:id", requireAuth, requireAdmin, productServiceProxy);
router.patch("/update/:id", requireAuth, requireAdmin, productServiceProxy);

// router.use((req, res, next) => {
//   console.log(`[DEBUG] Incoming request path: ${req.path}`);
//   next();
// });

export default router;
