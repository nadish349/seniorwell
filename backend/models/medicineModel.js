import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
    image: { type: String, required: false }, // Medicine image URL
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const medicineModel = mongoose.model("Medicine", medicineSchema);
export default medicineModel;
