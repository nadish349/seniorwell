import React, { useEffect, useState, useContext } from 'react';
import { VolunteerContext } from '../context/VolunteerContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const VolunteerRequests = ({ backendUrl }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, profile } = useContext(VolunteerContext); // 👈 grab token and profile from context

  const getVolunteerRequests = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/request/accept/${requestId}`,
        {
          volunteerId: profile?._id,
          volunteerName: profile?.name || 'Anonymous Volunteer'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success(`Request accepted successfully! Patient ${data.user.name} has been notified.`);
        // Refresh the requests list
        getVolunteerRequests();
      } else {
        toast.error(data.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/request/reject/${requestId}`,
        {
          volunteerId: profile?._id,
          volunteerName: profile?.name || 'Anonymous Volunteer',
          reason: reason || 'No reason provided'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success('Request rejected successfully');
        // Refresh the requests list
        getVolunteerRequests();
      } else {
        toast.error(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVolunteerRequests();
  }, []);

  return (
    <div className='mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Pending Volunteer Requests</h2>
        <button
          onClick={getVolunteerRequests}
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {loading && requests.length === 0 ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        requests.map((req) => (
          <div key={req._id} className='p-4 border rounded mb-4 shadow-sm bg-white'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <p><strong>User:</strong> {req.user?.name} ({req.user?.email})</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p><strong>Time:</strong> {req.time}</p>
                <p><strong>Assistance:</strong> {req.assistanceType}</p>
              </div>
              <div>
                <p><strong>Doctor:</strong> {req.appointment?.docId?.name} ({req.appointment?.docId?.speciality})</p>
                <p><strong>Hospital:</strong> {req.appointment?.docId?.hospital}</p>
                <p><strong>Request Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className='flex gap-2 mt-4'>
              <button
                onClick={() => handleAcceptRequest(req._id)}
                disabled={loading}
                className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50'
              >
                {loading ? 'Processing...' : 'Accept Request'}
              </button>
              <button
                onClick={() => handleRejectRequest(req._id)}
                disabled={loading}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50'
              >
                {loading ? 'Processing...' : 'Reject Request'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className='text-center py-8'>
          <p className='text-gray-500 text-lg'>No pending requests right now.</p>
          <p className='text-gray-400 text-sm mt-2'>Check back later for new volunteer requests.</p>
        </div>
      )}
    </div>
  );
};

const NotificationPanel = ({ backendUrl }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { token } = useContext(VolunteerContext);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications/volunteer`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${backendUrl}/api/notifications/read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          )}
        </div>
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

        {/* Notification Panel */}
        <NotificationPanel backendUrl={backendUrl} />
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
