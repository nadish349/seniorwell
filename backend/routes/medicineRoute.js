import express from "express";
import { addMedicine } from "../controllers/adminController.js";
import { getAllMedicines } from "../controllers/adminController.js";
import { medicineList } from "../controllers/medicineController.js";



import multer from "multer";

const medicineRouter = express.Router();

// Multer setup for handling image uploads
const upload = multer({ dest: "uploads/" });

// API route for adding a medicine with an image
medicineRouter.post("/", upload.single("image"), addMedicine);
medicineRouter.get("/get-medicines", getAllMedicines);

medicineRouter.get('/list',medicineList)
// medicineRouter.get("/list", MedicinesList);

export default medicineRouter;

