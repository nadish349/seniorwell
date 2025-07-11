// models/VolunteerRequest.js
import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment',
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
  // Fields for accepted requests
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
  },
  acceptedByName: String,
  acceptedAt: Date,
  // Fields for rejected requests
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
  },
  rejectedByName: String,
  rejectionReason: String,
  rejectedAt: Date,
}, { timestamps: true });

const requestModel = mongoose.model("VolunteerRequest", volunteerRequestSchema);
export default requestModel 