import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: { type: String, default: "" }, // No 'required' so it's optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" }, // No 'required' so it's optional
  skills: { type: String, default: "" }, // No 'required' so it's optional
  organization: { type: String, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Volunteer', volunteerSchema);


