// models/VolunteerRequest.js
import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  location: String,
  time: String,
  assistanceType: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const requestModel = mongoose.model("VolunteerRequest", volunteerRequestSchema);
export default requestModel 