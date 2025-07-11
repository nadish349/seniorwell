import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './config/mongodb.js'; // Import the database connection function
import connectCloudinary from './config/cloudinary.js'; // Corrected import path
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import volunteerRouter from "./routes/volunteerRoute.js"; 
import clubRouter from "./routes/clubRoute.js";
import medicineRouter from "./routes/medicineRoute.js";
import RequestRouter from "./routes/requestRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

import orderRouter from "./routes/medicineOrderRoutes.js";


// App config
const app = express();
const port = 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to Cloudinary
connectCloudinary()
  .then(() => {
    console.log('Cloudinary connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to Cloudinary:', error);
  });

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// API endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/volunteer',volunteerRouter)
app.use('/api/club',clubRouter)
app.use("/api/medicines", medicineRouter);

app.use("/api/buymed",orderRouter);
app.use('/api/request',RequestRouter)
app.use('/api/notifications', notificationRouter)




app.get("/", (req, res) => {
  res.send('API WORKING GOOD!');
});

// Start the server
app.listen(port, () => console.log('Server started on port', port));