import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const requiredEnvVars = ["SECRET"];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    `Error: Missing environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
const GATEWAY_PORT = 8000;

app.use((req, res, next) => {
  console.log(req.url + " " + req.method);
  next();
});

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

app.listen(GATEWAY_PORT, () => {
  console.log(`Gateway server running on ${GATEWAY_PORT}`);
});
