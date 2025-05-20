import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Appcontext } from '../context/Appcontext';

const Doctors = () => {
  const { speciality, center } = useParams(); // Get speciality and center from route parameters
  const [filterDoc, setFilterDoc] = useState([]); // State to store filtered doctors
  const navigate = useNavigate();
  const { doctors } = useContext(Appcontext); // Access doctors data from context
  const [showFilter, setShowFilter] = useState(false); // Toggle for filters visibility

  // Ensure doctors is always an array to prevent map errors
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  // Apply filter based on the selected specialty or center
  const applyFilter = () => {
    let filteredDoctors = safeDoctors;

    if (speciality) {
      filteredDoctors = filteredDoctors.filter(
        (doc) =>
          doc.speciality &&
          doc.speciality.toLowerCase() === speciality.toLowerCase()
      );
    }

    if (center) {
      filteredDoctors = filteredDoctors.filter(
        (doc) =>
          doc.hospital &&
          doc.hospital.toLowerCase() === center.toLowerCase()
      );
    }

    setFilterDoc(filteredDoctors);
  };

  // Reapply the filter whenever doctors, speciality, or center changes
  useEffect(() => {
    if (safeDoctors.length > 0) {
      applyFilter();
    } else {
      setFilterDoc([]); // Prevent undefined issues
    }
  }, [doctors, speciality, center]);

  // Render the component
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Button */}
      <button
        className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
          showFilter ? 'bg-primary text-white' : ''
        }`}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        Filters
      </button>

      {/* Left: Specializations List */}
      <div
        className={`w-full md:w-1/4 text-gray-600 sticky top-6 max-h-screen overflow-auto ${
          showFilter ? 'block' : 'hidden sm:block'
        }`}
      >
        <div>
          {/* Browse Specializations */}
          <p className="font-semibold text-lg mb-4">Browse Specializations</p>
          <div className="flex flex-col gap-4 text-gray-600">
            {[ 
              'General Physician',
              'Cardiology',
              'Orthopedics',
              'Urology',
              'Neurology',
              'Gastroenterology',
            ].map((spec, index) => (
              <p
                key={index}
                onClick={() =>
                  speciality === spec
                    ? navigate('/doctors')
                    : navigate(`/doctors/${spec}`)
                }
                className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-blue-100 hover:text-blue-600 ${
                  speciality &&
                  speciality.toLowerCase() === spec.toLowerCase()
                    ? 'bg-indigo-100 text-black' // Highlight for selected specialty
                    : ''
                }`}
              >
                {spec}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Doctors List */}
      <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
        {filterDoc.length > 0 ? (
          filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img
                className="bg-blue-50 w-full h-40 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600">{item.speciality}</p>

                {/* Display Hospital Name */}
                <p className="text-lg text-gray-700 mt-2">
                  <span className="text-lg font-semibold text-blue-700 mt-2">Hospital: </span>
                  {item.hospital}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No doctors found for this specialization or hospital.
          </p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
