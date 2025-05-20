import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Appcontext } from '../context/Appcontext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from './RelatedDoctors';
import { toast} from 'react-toastify';
import axios from 'axios';
const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol ,backendUrl,token,getDoctorsData} = useContext(Appcontext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];


  const navigate =useNavigate()
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch doctor info
  useEffect(() => {
    const docData = doctors.find((doc) => doc._id === docId);
    setDocInfo(docData);
  }, [doctors, docId]);

  // Get available slots
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const getAvailableSlots = () => {
    setDocSlots([]);
    let today = new Date();
    let allSlots = [];
  
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);
  
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }
  
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
  
        const slotDate = `${day}-${month}-${year}`;
        const slotTime = formattedTime;
  
        // Ensure that booked slots are not shown
        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime);
  
        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
  
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
  
      // Only add the day if there are available slots
      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }
  
    setDocSlots(allSlots);
  };
  

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }
  
    if (!selectedSlot) {
      toast.warn('Please select a time slot');
      return;
    }
  
    try {
      const slotTime = selectedSlot.time;
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;
  
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
  
      if (data.success) {
        toast.success(data.message);
        await getDoctorsData(); // ✅ Refresh doctors data
        setDocInfo(doctors.find((doc) => doc._id === docId)); // ✅ Update docInfo
        getAvailableSlots(); // ✅ Regenerate available slots
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  






  const handleSlotSelection = (dayIndex, slot) => {
    setSlotIndex(dayIndex);
    setSelectedSlot(slot);
  };

  // ✅ Fix address rendering issue
  const addressString = docInfo?.address
    ? `${docInfo.address.line1 || ''} ${docInfo.address.line2 || ''}`.trim()
    : 'N/A';

  // ✅ Open Google Maps with hospital name & full address
  const handleGetDirections = () => {
    if (docInfo?.hospital || addressString !== 'N/A') {
      const searchQuery = encodeURIComponent(`${docInfo.hospital || ''}, ${addressString}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, "_blank");
    } else {
      alert("Hospital name or address is not available!");
    }
  };

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button>{docInfo.experience} Years Experience</button>
            </div>

            {/* 🏥 Hospital Name & 📍 Get Directions Button */}
            <div className="mt-3 flex items-center gap-3">
              <p className="text-gray-800 font-medium">
                <span className="text-lg font-bold text-blue-700">Hospital:</span> {docInfo.hospital || "N/A"}
              </p>

              {/* 📍 Get Directions Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
                onClick={handleGetDirections}
              >
                📍 Get Directions
              </button>
            </div>

            {/* 🏠 Address */}
            {addressString !== 'N/A' && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-semibold">Address:</span> {addressString}
              </p>
            )}

            <div>
              <p>About <img src={assets.info_icon} alt="Info" /></p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
            {docSlots.length > 0 &&
              docSlots.map((daySlots, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === dayIndex ? 'bg-primary text-white' : 'border border-gray-200'
                  }`}
                  onClick={() => handleSlotSelection(dayIndex, daySlots[0])}
                >
                  <p>{daySlots[0] && daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                  <p>{daySlots[0] && daySlots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          {docSlots[slotIndex] && (
            <div className="mt-2">
              <div className="flex gap-2 mt-7 overflow-x-auto scrollbar-hide rounded-lg-10" style={{ scrollBehavior: 'smooth' }}>
                {docSlots[slotIndex].map((slot, index) => (
                  <button
                    key={index}
                    className={`py-1 px-6 rounded-full border text-sm ${
                      selectedSlot?.time === slot.time ? 'bg-primary text-white' : 'border-gray-200 text-gray-600'
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>    
            </div>
          )}

          {selectedSlot && (
            <div className="mt-4">
              <button onClick={bookAppointment} className="px-14 py-3 bg-primary text-white font-medium rounded-full">
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
