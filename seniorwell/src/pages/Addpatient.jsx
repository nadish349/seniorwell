import React, { useState, useContext } from "react";
import { Appcontext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

const AddPatient = () => {
  const { backendUrl, token } = useContext(Appcontext);
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    contactNumber: "",
    medicalCondition: "",
    address: "",
  });

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const clubId = localStorage.getItem("clubId"); // Retrieve clubId
  
    if (!clubId) {
      toast.error("Club ID missing. Please log in again.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${backendUrl}/api/club/register-patient/${clubId}`,
        patientData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        toast.success("Patient added successfully!");
        setPatientData({ name: "", age: "", contactNumber: "", medicalCondition: "", address: "" });
      } else {
        toast.error("Error adding patient.");
      }
    } catch (error) {
      toast.error("Server error occurred.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4">Add Patient</h2>
      <form onSubmit={handleAddPatient} className="grid gap-4 w-96 bg-white p-6 rounded-lg shadow">
        <input type="text" placeholder="Name" value={patientData.name} onChange={(e) => setPatientData({ ...patientData, name: e.target.value })} className="p-2 border rounded" required />
        <input type="number" placeholder="Age" value={patientData.age} onChange={(e) => setPatientData({ ...patientData, age: e.target.value })} className="p-2 border rounded" required />
        <input type="text" placeholder="Contact Number" value={patientData.contactNumber} onChange={(e) => setPatientData({ ...patientData, contactNumber: e.target.value })} className="p-2 border rounded" required />
        <input type="text" placeholder="Medical Condition" value={patientData.medicalCondition} onChange={(e) => setPatientData({ ...patientData, medicalCondition: e.target.value })} className="p-2 border rounded" />
        <input type="text" placeholder="Address" value={patientData.address} onChange={(e) => setPatientData({ ...patientData, address: e.target.value })} className="p-2 border rounded" required />
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatient;
