import mongoose from 'mongoose';

export const connectDB = async () => {

  
  await mongoose.connect("mongodb+srv://nadishnp:621311@cluster0.ppwt0.mongodb.net/SENIORWELL").then(()=>console.log("db connected"));
};

export default connectDB;
