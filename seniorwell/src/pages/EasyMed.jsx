import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EasyMed = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const navigate = useNavigate();

  const aToken = localStorage.getItem("aToken"); // Retrieve token
  const backendUrl = "http://localhost:4000/api"; // ✅ Ensure backend URL is correct

  
  const medicineTypes = [
    "All",
    "Pain Relief",
    "Antibiotics",
    "Vitamins & Supplements",
    "Cold & Cough",
    "Skin Care",
    "Digestive Health",
    "Heart & Blood Pressure",
    "Diabetes Care",
    "Eye Care",
    "Allergy Medications",
  ];

  // ✅ Fetch all medicines
  useEffect(() => {
    const getMedicinesData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/medicines/list`, {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        });
        if (data.success) {
          setMedicines(data.medicines);
          setFilteredMedicines(data.medicines); // Show all medicines by default
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    getMedicinesData();
  }, [aToken]);

  // ✅ Filter medicines by type
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    if (type === "All") {
      setFilteredMedicines(medicines);
    } else {
      setFilteredMedicines(medicines.filter((med) => med.type === type));
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-xl font-semibold mb-4">Browse Medicines</h1>

      {/* Browse by Type */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">Browse by Type:</label>
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedType}
          onChange={handleTypeChange}
        >
          {medicineTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Medicine List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/medicines/${item._id}`)}

              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50 w-full h-40 object-cover" src={item.image} alt={item.name} />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600">₹{item.price}</p>

                <div className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-red-500"}`}>
                  <p className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-red-500"} rounded-full`}></p>
                  <p>{item.available ? "Available" : "Out of Stock"}</p>
                </div>

                <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/buymed/${item._id}`);
  }}
  className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  disabled={!item.available}
>
  {item.available ? "Buy Now" : "Unavailable"}
</button>


              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No medicines found.</p>
        )}
      </div>
    </div>
  );
};

export default EasyMed;
