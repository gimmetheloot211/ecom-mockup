import express from "express";
import productControllers from "../controllers/productControllers";

const router = express.Router();

router.get("/id/:id", productControllers.productGet);
router.get("/all", productControllers.productGetAll);
router.post("/create", productControllers.productCreate);
router.delete("/delete/:id", productControllers.productDelete);
router.patch("/update/:id", productControllers.productUpdate);

export default router;
