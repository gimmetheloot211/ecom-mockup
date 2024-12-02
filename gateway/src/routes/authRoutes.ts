import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";

import requireAuth from "../middleware/authMiddleware";
import requireAdmin from "../middleware/adminMiddleware";

dotenv.config();

const router = express.Router();
const AUTH_PORT = 8001;

const authServiceProxy: RequestHandler = createProxyMiddleware({
  target: `http://auth:${AUTH_PORT}`,
  changeOrigin: true,
  timeout: 10000,
  proxyTimeout: 10000,
});

// Unauthenticated routes
router.post("/login", authServiceProxy);
router.post("/signup", authServiceProxy);

// Authenticated routes
router.get("/user", requireAuth, authServiceProxy);
router.patch("/user", requireAuth, authServiceProxy);

// Admin routes
router.get("/user/:id", requireAuth, requireAdmin, authServiceProxy);

// router.use((req, res, next) => {
//   console.log(`[DEBUG] Incoming request path: ${req.path}`);
//   next();
// });

export default router;
