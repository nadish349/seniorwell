import React, { useContext, useEffect, useState } from 'react';
import { Appcontext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(Appcontext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const requestVolunteer = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/request/create',
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Volunteer requested successfully');
        getUserAppointments(); // refresh appointments to reflect volunteer request status
      } else {
        toast.error(data.message || 'Failed to request volunteer');
      }
    } catch (error) {
      console.error('Request Volunteer Error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } });
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } });

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error('Failed to create Razorpay order');
      }
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
      toast.error('Error initiating Razorpay payment');
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div 
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' 
              key={index}
            >
              {/* Doctor Image */}
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt={item.name} />
              </div>

              {/* Doctor Details */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Hospital:</p>
                <p className='text-xs text-blue-600'>{item.docData.hospital || 'N/A'}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address?.line1 || 'N/A'}</p>
                <p className='text-xs'>{item.docData.address?.line2 || 'N/A'}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> 
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && (
                  <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'> Paid</button>
                )}
                {!item.cancelled && !item.payment && (
                  <>
                    <button
                      onClick={() => requestVolunteer(item._id)}
                      className='text-sm text-blue-500 text-center sm:min-w-48 py-2 border green-500 hover:bg-blue-600 hover:text-white transition-all duration-300'
                    >
                     🖐️ Request Volunteer 
                    </button>
                    
                    <button 
                      onClick={() => appointmentRazorpay(item._id)} 
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'
                    >
                      Pay Online
                    </button>
                  </>
                )}
                {!item.cancelled && (
                  <button 
                    onClick={() => cancelAppointment(item._id)} 
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
