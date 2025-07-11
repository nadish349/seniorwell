import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const VolunteerContext = createContext();

const VolunteerContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('volunteerToken') || '');
  const [profile, setProfile] = useState(null);
  const backendUrl = 'http://localhost:4000'; // ✅ Change this if your backend URL is different

  // Fetch profile when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/api/volunteer/get-volunteers-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            setProfile(response.data.volunteer);
          }
        } catch (error) {
          console.error('Error fetching volunteer profile:', error);
        }
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <VolunteerContext.Provider value={{ backendUrl, token, setToken, profile, setProfile }}>
      {children}
    </VolunteerContext.Provider>
  );
};

export default VolunteerContextProvider;