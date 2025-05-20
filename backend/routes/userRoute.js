import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment ,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay ,requestVolunteer ,clearVolunteerRequest  } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { createVolunteerRequest } from '../controllers/requestController.js';
import authRequest from '../middlewares/authRequest.js';
const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected Routes
userRouter.get('/get-profile', authUser, getProfile);  // ✅ Fix: Corrected method & ensured token use
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile); // ✅ Changed PUT to POST
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment )
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
userRouter.post('/request-volunteer', authUser, requestVolunteer);
userRouter.post('/request-volunteer', authRequest, createVolunteerRequest);
userRouter.post('/clear-volunteer-request', authUser, clearVolunteerRequest);

export default userRouter;
