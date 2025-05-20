import express from "express";
import { placeMedicineOrder } from "../controllers/medicineOrderController.js";

const orderRouter = express.Router();

orderRouter.post("/buymed", placeMedicineOrder);

export default orderRouter;
