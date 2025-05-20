import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import medicineModel from "../models/medicineModel.js";
import appointmentModel from "../models/AppointmentModel.js";

// Admin login function
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for adding a doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, hospital } = req.body;
        const imageFile = req.file; // Image file from Multer

        // Validate required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !hospital) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash doctor's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary (only if provided)
        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            hospital,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


 

//api to get all doctors list for admin panel


const allDoctors =async (req,res) => {
try {
    
    const doctors = await doctorModel.find({}).select('-password');
    res.json({success:true,doctors})

} catch (error) {
    console.log(error);
    res.json({ success:false, message:error.message });
}
} 


const  appointmentsAdmin =async (req,res) =>{
  try {
       const appointments = await appointmentModel.find({})
       res.json({success:true,appointments})
  } catch (error) {
    console.log(error);
    res.json({ success:false, message:error.message });
  }
}


// Add a new medicine
const addMedicine = async (req, res) => {
  try {
    const { name, type, price, stock, description } = req.body;
    const imageFile = req.file; // Image file from Multer

    // Validate required fields
    if (!name || !type || !price || !stock || !description) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate name length
    if (name.length < 3) {
      return res.json({ success: false, message: "Medicine name is too short" });
    }

    // Validate price
    if (price <= 0) {
      return res.json({ success: false, message: "Price must be greater than zero" });
    }

    // Upload image to Cloudinary (if provided)
    let imageUrl = "";
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    // Create medicine entry
    const newMedicine = new medicineModel({
      name,
      type,
      price,
      stock,
      description,
      image: imageUrl,
    });

    await newMedicine.save();
    res.json({ success: true, message: "Medicine Added Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get list of medicines



// Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find({});
    res.json({ success: true, medicines });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

 
const appointmentCancel = async (req, res) => { 
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment cancelled' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//api to get dashboard data  for admin panel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export { loginAdmin, addDoctor, allDoctors,addMedicine,getAllMedicines ,appointmentsAdmin,appointmentCancel,adminDashboard};
