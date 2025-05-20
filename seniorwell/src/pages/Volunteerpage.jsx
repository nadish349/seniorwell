import React, { useEffect, useState, useContext } from 'react';
import { VolunteerContext } from '../context/VolunteerContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const VolunteerRequests = ({ backendUrl }) => {
  const [requests, setRequests] = useState([]);
  const { token } = useContext(VolunteerContext); // 👈 grab token from context

  const getVolunteerRequests = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/request/for-volunteers`, {
        headers: { Authorization: `Bearer ${token}` }, // 👈 include token
      });

      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getVolunteerRequests();
  }, []);

  return (
    <div className='mt-6'>
      <h2 className='text-xl font-semibold mb-4'>Pending Volunteer Requests</h2>
      {requests.length > 0 ? (
        requests.map((req) => (
          <div key={req._id} className='p-4 border rounded mb-4 shadow-sm'>
            <p><strong>User:</strong> {req.user.name} ({req.user.email})</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p><strong>Time:</strong> {req.time}</p>
            <p><strong>Assistance:</strong> {req.assistanceType}</p>
            <p><strong>Doctor:</strong> {req.appointment?.docId?.name} ({req.appointment?.docId?.speciality})</p>
            <p><strong>Hospital:</strong> {req.appointment?.docId?.hospital}</p>
          </div>
        ))
      ) : (
        <p className='text-gray-500'>No pending requests right now.</p>
      )}
    </div>
  );
};

const VolunteerPage = () => {
  const { backendUrl, token, setToken } = useContext(VolunteerContext);

  const [profile, setProfile] = useState(null);
  const [showVolunteerDropdown, setShowVolunteerDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/volunteer/get-volunteers-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProfile(response.data.volunteer);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch profile');
        console.error(error);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [backendUrl, token, navigate]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleAvailabilityToggle = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/volunteer/toggle-availability`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          available: response.data.available,
        }));
        toast.success(`Availability set to ${response.data.available ? 'Active' : 'Offline'}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update availability');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* ✅ Top Right Section (Volunteer Profile & Name Box) */}
      <div className="absolute top-4 right-4 flex flex-col items-center space-y-2">
        <div className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md text-lg font-semibold">
          {profile?.name || 'Loading...'}
        </div>

        <button
          onClick={handleAvailabilityToggle}
          className={`px-5 py-2 font-semibold rounded-full text-white transition-all duration-300 ${
            profile?.available ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
          }`}
        >
          {profile?.available ? 'Active' : 'Offline'}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowVolunteerDropdown(!showVolunteerDropdown)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Volunteer Profile ▼
          </button>

          {showVolunteerDropdown && (
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <button
                onClick={() => navigate('/volunteerprofile')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Volunteer Details
              </button>
              <button
                onClick={() => navigate('/volunteer-appointments')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Volunteer Appointments
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Main Content Area */}
      <main className="p-6 pt-20">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {profile?.name || 'Volunteer'}!</h1>
        <p className="mt-2 text-gray-600">Here, you can explore volunteer activities and events.</p>

        {/* ✅ Display Volunteer Requests Here */}
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <VolunteerRequests backendUrl={backendUrl} />
        </div>
      </main>
    </div>
  );
};

export  default VolunteerPage ;
