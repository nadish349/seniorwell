import express from "express";
import { addDoctor, addMedicine, getAllMedicines, loginAdmin,appointmentsAdmin, appointmentCancel,adminDashboard} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

import { allDoctors } from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import {changeMedicineAvailability} from"../controllers/medicineController.js"

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin); // New login route
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/add-medicine", authAdmin, upload.single("image"), addMedicine);

adminRouter.get('/all-medicines',authAdmin,getAllMedicines)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',changeAvailability)
adminRouter.post('/change-medicine-availability',changeMedicineAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
export default adminRouter;
