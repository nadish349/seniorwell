import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BuyMed = () => {
  const navigate = useNavigate();
  const { medId } = useParams(); // assumes you're passing medId in the route
  const userId = localStorage.getItem("userId"); // ensure this is set during login

  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    state: "",
    phone: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/med-order/place-order", {
        userId,
        medicineId: medId,
        ...formData,
      });

      if (res.data.success) {
        alert("Order placed successfully!");
        navigate("/easymed");
      } else {
        alert("Order failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Order error: ", err);
      alert("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Enter Delivery Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={formData.paymentMethod === "COD"}
              onChange={handleChange}
              className="mr-2"
            />
            COD
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Online"
              checked={formData.paymentMethod === "Online"}
              onChange={handleChange}
              className="mr-2"
            />
            Pay Now
          </label>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default BuyMed;
