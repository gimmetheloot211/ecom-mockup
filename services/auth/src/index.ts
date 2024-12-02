import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";

dotenv.config();

const requiredEnvVars: string[] = ["MONGO_URI", "SECRET"];

const missingEnvVars: string[] = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    `Error: Missing environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const app = express();
const AUTH_PORT = 8001;
const MONGO_URI = process.env.MONGO_URI!;

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.url + " " + req.method);
  next();
});
app.use("/", userRoutes);

mongoose
  .connect(MONGO_URI)
  .then((res) =>
    app.listen(AUTH_PORT, () => {
      console.log(`Listening on port ${AUTH_PORT}`);
    })
  )
  .catch((err) => console.log(err));
