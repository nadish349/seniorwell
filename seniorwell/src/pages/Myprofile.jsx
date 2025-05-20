import React, { useContext, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets_frontend/assets';
import { Appcontext } from '../context/Appcontext';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(Appcontext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  // ✅ Function to Update Profile Data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' })); // ✅ Address properly formatted
      formData.append('gender', userData.gender || "not selected");
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      console.log("Sending formData:", Object.fromEntries(formData.entries())); // Debugging

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    userData && (
      <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-md">
        {/* ✅ Profile Image Section */}
        <div className="flex items-center mb-6">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-36 h-36 rounded-full object-cover border border-gray-300"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
                <img className="w-8 absolute bottom-4 right-4" src={image ? '' : assets.upload_icon} alt="Upload" />
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <img src={userData.image} alt="Profile" className="w-24 h-24 rounded-full mr-4 border border-gray-300" />
          )}
        </div>

        {/* ✅ Profile Form Section */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600">Full Name</label>
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.name}</p>
            )}
          </div>

          {/* Email (Not Editable) */}
          <div>
            <label className="block text-gray-600">Email</label>
            <p className="text-gray-800">{userData.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-600">Phone</label>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.phone || "N/A"}</p>
            )}
          </div>

          {/* ✅ Address (Now Supports 2 Lines) */}
          <div>
            <label className="block text-gray-600">Address (Line 1)</label>
            {isEdit ? (
              <input
                type="text"
                value={userData.address?.line1 || ""}
                onChange={(e) => setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value }
                }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.address?.line1 || "N/A"}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600">Address (Line 2)</label>
            {isEdit ? (
              <input
                type="text"
                value={userData.address?.line2 || ""}
                onChange={(e) => setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value }
                }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.address?.line2 || "N/A"}</p>
            )}
          </div>

          {/* ✅ Gender (Properly Updates Now) */}
          <div>
            <label className="block text-gray-600">Gender</label>
            {isEdit ? (
              <select
                value={userData.gender || "not selected"}
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                className="border p-2 w-full rounded"
              >
                <option value="not selected">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-800 capitalize">{userData.gender || "Not Selected"}</p>
            )}
          </div>

          {/* Date of Birth (DOB) */}
          <div>
            <label className="block text-gray-600">Date of Birth</label>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.dob || "N/A"}</p>
            )}
          </div>
        </div>

        {/* ✅ Edit / Save Button */}
        <div className="text-center mt-6">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Information
            </button>
          ) : (
            <button onClick={() => setIsEdit(true)} className="bg-primary text-white px-4 py-2 rounded">
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
