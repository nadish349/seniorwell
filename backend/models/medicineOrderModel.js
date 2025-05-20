import mongoose from "mongoose";

const medicineOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
  orderStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MedicineOrder", medicineOrderSchema);
