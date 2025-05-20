import React, { useContext, useEffect, useState } from 'react';
import { Appcontext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(Appcontext); // Use context to get doctors data
  const navigate = useNavigate(); // Fix missing parentheses
  const [relDocs, setRelDocs] = useState([]); // State for related doctors

  // Filter related doctors based on speciality and excluding current doctor
  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-8 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Explore other trusted doctors in the same speciality
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 px-3 sm:px-0">
        {relDocs.length > 0 ? (
          relDocs.slice(0, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => {navigate(`/appointments/${item._id}`); scrollTo (0,0)}}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <img
                className="bg-blue-50 w-full h-60 object-cover" // Increased frame size
                src={item.image}
                alt={item.name}
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No related doctors found.
          </p>
        )}
      </div>
      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default RelatedDoctors;
