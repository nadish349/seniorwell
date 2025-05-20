import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  registeredPatients: [
    {
      name: String,
      age: Number,
      contactNumber: String,
      medicalCondition: String,
      address: String,
    },
  ],
  volunteerRequests: [
    {
      patientId: String,
      description: String,
      status: {
        type: String,
        default: "Pending",
      },
    },
  ],
  massCheckupCampaigns: [
    {
      title: String,
      date: Date,
      location: String,
      description: String,
      volunteersNeeded: Number,
    },
  ],
});

const Club = mongoose.model('Club', clubSchema);

export default Club;