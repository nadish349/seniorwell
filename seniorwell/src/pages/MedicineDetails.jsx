import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const aToken = localStorage.getItem("aToken");
  const backendUrl = "http://localhost:4000/api";

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/admin/medicine/${id}`, {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        });
        if (data.success) {
          setMedicine(data.medicine);
        } else {
          console.error("Failed to fetch medicine");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!medicine) return <div className="p-6">Medicine not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{medicine.name}</h1>
      <img
        src={medicine.image}
        alt={medicine.name}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />
      <p className="mb-2"><strong>Type:</strong> {medicine.type}</p>
      <p className="mb-2"><strong>Price:</strong> ₹{medicine.price}</p>
      <p className="mb-4"><strong>Status:</strong> {medicine.available ? "Available" : "Out of Stock"}</p>
      <p><strong>Description:</strong> {medicine.description || "No description available."}</p>
    </div>
  );
};

export default MedicineDetails;

