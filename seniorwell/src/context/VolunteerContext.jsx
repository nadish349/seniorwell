import React, { createContext, useState } from 'react';

export const VolunteerContext = createContext();

const VolunteerContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('volunteerToken') || '');
  const backendUrl = 'http://localhost:4000'; // ✅ Change this if your backend URL is different

  return (
    <VolunteerContext.Provider value={{ backendUrl, token, setToken }}>
      {children}
    </VolunteerContext.Provider>
  );
};

export default VolunteerContextProvider;