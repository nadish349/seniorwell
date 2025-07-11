import validator from 'validator';
import bcrypt from 'bcryptjs';
import volunteerModel from '../models/volunteerModel.js';
import jwt from 'jsonwebtoken';

// ✅ Register Volunteer (Only requires email, password, organization)
const registerVolunteer = async (req, res) => {
  try {
    const { email, password, organization } = req.body;

    // Check for missing required fields
    if (!email || !password || !organization) {
      return res.json({ success: false, message: 'Missing details' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create volunteer with defaults for missing fields
    const newVolunteer = new volunteerModel({
      name: "", // Empty, user can update later
      email,
      password: hashedPassword,
      phone: "", // Empty, user can update later
      skills: "", // Empty, user can update later
      organization,
    });

    const volunteer = await newVolunteer.save();

    // Generate JWT token
    const token = jwt.sign({ id: volunteer._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Volunteer Login (No Changes)
const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const volunteer = await volunteerModel.findOne({ email });

    // Check if volunteer exists
    if (!volunteer) {
      return res.json({ success: false, message: 'Volunteer does not exist' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign({ id: volunteer._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// ✅ Get Logged-In Volunteer Profile
// ✅ Get Logged-In Volunteer Profile
const getVolunteerProfile = async (req, res) => {
  try {
    res.json({ success: true, volunteer: req.volunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Volunteer Profile
const updateVolunteerProfile = async (req, res) => {
  try {
    const volunteerId = req.volunteer._id;
    const { name, phone, skills, organization } = req.body;

    let updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (skills) updateData.skills = skills;
    if (organization) updateData.organization = organization;

    const updatedVolunteer = await volunteerModel.findByIdAndUpdate(
      volunteerId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedVolunteer) {
      return res.status(404).json({ success: false, message: "Volunteer not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", volunteer: updatedVolunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const volunteerId = decoded.id;

    // ✅ Toggle the 'available' field
    const volunteer = await volunteerModel.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: "Volunteer not found" });
    }

    volunteer.available = !volunteer.available; // Toggle availability
    await volunteer.save();

    res.json({ success: true, message: "Availability updated", available: volunteer.available });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export { registerVolunteer, loginVolunteer, getVolunteerProfile , updateVolunteerProfile, updateAvailability};

