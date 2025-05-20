import medicineModel from "../models/medicineModel.js";

// Change medicine availability
const changeMedicineAvailability = async (req, res) => {
  try {
    const { medId } = req.body;

    const medData = await medicineModel.findById(medId);
    if (!medData) {
      return res.json({ success: false, message: "Medicine not found" });
    }

    await medicineModel.findByIdAndUpdate(medId, { available: !medData.available });

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all medicines
const medicineList = async (req, res) => {
    try {
      const medicines = await medicineModel.find({});
      res.json({ success: true, medicines });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  

export { changeMedicineAvailability,medicineList };


