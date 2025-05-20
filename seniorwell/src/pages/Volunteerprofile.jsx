import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { VolunteerContext } from '../context/VolunteerContext';

import { toast } from "react-toastify";

const VolunteerProfile = () => {
  const { backendUrl, token, setToken } = useContext(VolunteerContext);
;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    organization: "",
    available: true,  // 🔥 New field for availability
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Volunteer Profile on Load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/api/volunteer/get-volunteers-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setFormData(response.data.volunteer);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl, token]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.skills || !formData.organization) {
      return toast.error("Please fill out all fields before submitting.");
    }

    try {
      const response = await axios.post(`${backendUrl}/api/volunteer/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFormData(response.data.volunteer);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  // ✅ Handle Availability Toggle
  const handleAvailabilityToggle = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/volunteer/toggle-availability`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFormData({ ...formData, available: response.data.available });  // 🔥 Update UI
        toast.success(`Availability set to ${response.data.available ? "Active" : "Offline"}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Update Profile</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>

          {/* Availability Toggle (Now right below Name) */}
          <div className="flex justify-center">
            <button 
              onClick={handleAvailabilityToggle} 
              type="button"
              className={`mt-2 px-5 py-2 font-semibold rounded-full text-white transition-all duration-300 ${
                formData.available ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
              }`}
            >
              {formData.available ? "Active" : "Offline"}
            </button>
          </div>

          {/* Email (Non-Editable) */}
          <div>
            <label className="block text-gray-600">Email</label>
            <input type="email" name="email" value={formData.email} className="border p-2 w-full rounded bg-gray-100" disabled />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-600">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-600">Skills</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-gray-600">Organization</label>
            <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default VolunteerProfile;

