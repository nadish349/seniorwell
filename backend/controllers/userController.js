import validator from 'validator';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/AppointmentModel.js'; 
import  razorpay from 'razorpay'
// ✅ Register User API
// ✅ Register User API
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Login User API
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get User Profile API (Fixed)
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get userId from token (not from body)
    const userData = await userModel.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Update User Profile API
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get userId from token
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Parse address
    let parsedAddress = {};
    try {
      if (address) {
        parsedAddress = JSON.parse(address);
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    // Update user details
    const updateData = { name, phone, address: parsedAddress, dob, gender };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to add appointment

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id; // ✅ Get userId from the authenticated user

    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (!docData.available) {
      return res.status(400).json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = docData.slots_booked || {};

    // Check slot availability
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    // Update booked slots
    slots_booked[slotDate] = slots_booked[slotDate] || [];
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: new Date(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots in the doctor's profile
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//API TO GET USER APPOINTMENTS
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Correct way to get userId from authenticated request
    const appointments = await appointmentModel.find({ userId }).populate('docId'); // ✅ Ensure doctor data is populated

    res.json({ success: true, appointments });
  } catch (error) { 
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const cancelAppointment = async (req, res) => { 
  try {
    const appointmentId = req.body.appointmentId;
    const userId = req.user.id; // ✅ Extract userId from authenticated request

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    // ✅ Ensure both IDs are strings before comparison
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // ✅ Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    let slots_booked = doctorData.slots_booked || {};
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment cancelled' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// Razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" });
    }

    // Creating options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creation of order (make sure this is correctly awaited)
    const order = await razorpayInstance.orders.create(options);

    // Respond with the order details
    res.json({ success: true, order });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


//API TO VERIFY PAYMENT OF RAZORPAY 
const verifyRazorpay = async(req,res) => {
  try {
    
    const{razorpay_order_id} =req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    
     if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment successful"})
     }  else{
      res.json({success:false,message:"Payment failed"})
     }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// api to request volunteer


 const requestVolunteer = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { requestVolunteer: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer requested successfully',
      user,
    });
  } catch (error) {
    console.error('Error requesting volunteer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const clearVolunteerRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { requestVolunteer: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer request cleared',
      user,
    });
  } catch (error) {
    console.error('Error clearing volunteer request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment ,listAppointment ,cancelAppointment  ,paymentRazorpay ,verifyRazorpay,requestVolunteer,clearVolunteerRequest};
