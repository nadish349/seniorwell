import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const WelfareClubs = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
        {/* Logo & Text */}
        <div className="flex items-center gap-2 text-xs">
          <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="" />
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
            Welfare Club
          </p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => console.log("Logout clicked")} 
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      {/* Welfare Clubs Section */}
      <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 mt-5">
        {/* Left Side */}
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
            WE ARE HERE TO HELP
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
            <img className="w-28" src={assets.group_profiles} alt="" />
            <p>Committed to success</p>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col items-start gap-3 mt-4">
            <button
              onClick={() => navigate("/add-patient")}
              className="px-6 py-3 bg-white text-gray-600 text-sm font-semibold rounded-full shadow hover:scale-105 transition-all duration-300"
            >
              Add Patient
            </button>
            <button
              onClick={() => navigate("/request-volunteer")}
              className="px-6 py-3 bg-white text-gray-600 text-sm font-semibold rounded-full shadow hover:scale-105 transition-all duration-300"
            >
              Request Volunteer
            </button>
            <button
              onClick={() => navigate("/request-campaign")}
              className="px-6 py-3 bg-white text-gray-600 text-sm font-semibold rounded-full shadow hover:scale-105 transition-all duration-300"
            >
              Request Campaign
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="md:w-1/2 relative">
          <img
            className="md:absolute bottom-0 min-h-[85vh] max-w-[1400px] rounded-lg"
            src={assets.volunteer_img}
            alt="Welfare Clubs"
          />
        </div>
      </div>
    </div>
  );
};

export default WelfareClubs;

