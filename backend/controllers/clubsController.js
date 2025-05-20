import validator from 'validator';
import bcrypt from 'bcrypt';
import clubModel from '../models/clubModel.js';
import jwt from 'jsonwebtoken';

// ✅ Register Club API
export const registerClub = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details: name, email, or password" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const existingClub = await clubModel.findOne({ email });
    if (existingClub) {
      return res.status(400).json({ success: false, message: "Club with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClub = new clubModel({ name, email, password: hashedPassword });
    const club = await newClub.save();

    const token = jwt.sign({ id: club._id }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, token, clubId: club._id });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Club Login API
export const loginClub = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const club = await clubModel.findOne({ email });
    if (!club) {
      return res.status(404).json({ success: false, message: "Club does not exist" });
    }

    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: club._id }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, token, clubId: club._id });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get Club Details
export const getClubDetails = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    res.status(200).json({ success: true, club });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Register a Patient under a Club
export const registerPatientForClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, age, contactNumber, medicalCondition, address } = req.body;

    if (!name || !age || !contactNumber || !address) {
      return res.status(400).json({ success: false, message: "Missing patient details" });
    }

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    club.registeredPatients.push({ name, age, contactNumber, medicalCondition, address });
    await club.save();

    res.status(201).json({ success: true, message: "Patient registered successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Request a Volunteer for a Patient
export const requestVolunteer = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { patientId, description } = req.body;

    if (!patientId || !description) {
      return res.status(400).json({ success: false, message: "Missing patientId or description" });
    }

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    club.volunteerRequests.push({ patientId, description, status: "Pending" });
    await club.save();

    res.status(201).json({ success: true, message: "Volunteer request created successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Create a Mass Checkup Campaign
export const createCampaign = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, date, location, description, volunteersNeeded } = req.body;

    if (!title || !date || !location || !description || !volunteersNeeded) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    club.massCheckupCampaigns.push({ title, date, location, description, volunteersNeeded });
    await club.save();

    res.status(201).json({ success: true, message: "Campaign created successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
