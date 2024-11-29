import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import requireAuth from "../middleware/authMiddleware";
import requireAdmin from "../middleware/adminMiddleware";

dotenv.config();

const router = express.Router();
const AUTH_PORT = 8001;

const authServiceProxy = createProxyMiddleware({
  target: `http://auth:${AUTH_PORT}`,
  changeOrigin: true,
  timeout: 10000,
  proxyTimeout: 10000,
});

router.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request path: ${req.path}`);
  next();
});

router.post("/login", authServiceProxy);
router.post("/signup", authServiceProxy);

router.get("/user", requireAuth, authServiceProxy);
router.patch("/user", requireAuth, authServiceProxy);

router.get("/user/:id", requireAuth, requireAdmin, authServiceProxy);

export default router;
