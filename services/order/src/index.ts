import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const requiredEnvVars = ["MONGO_URI"];

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
const ORDER_PORT = 8003;
const MONGO_URI = process.env.MONGO_URI!;

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url + " " + req.method);
  next();
});

app.use("/cart", cartRoutes);
app.use("/", orderRoutes);

mongoose
  .connect(MONGO_URI)
  .then((res) =>
    app.listen(ORDER_PORT, () => {
      console.log(`Listening on port ${ORDER_PORT}`);
    })
  )
  .catch((err) => console.log(err));
