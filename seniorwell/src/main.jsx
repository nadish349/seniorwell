import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppcontextProvider from './context/Appcontext.jsx';
import VolunteerContextProvider from './context/VolunteerContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <VolunteerContextProvider>
    <AppcontextProvider>
    <App />
    </AppcontextProvider>
  </VolunteerContextProvider>
    </BrowserRouter>
  </StrictMode>
);
