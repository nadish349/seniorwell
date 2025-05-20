import MedicineOrder from "../models/medicineOrderModel.js";

export const placeMedicineOrder = async (req, res) => {
  try {
    const { userId, medicineId, address, pincode, state, phone, paymentMethod } = req.body;

    const order = await MedicineOrder.create({
      userId,
      medicineId,
      address,
      pincode,
      state,
      phone,
      paymentMethod,
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
