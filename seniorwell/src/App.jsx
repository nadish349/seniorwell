import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/contact';
import Myprofile from './pages/Myprofile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './components/Appointment';
import Welfareclubs from './pages/Welfareclubs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EasyMed from './pages/EasyMed';
import Volunteer from './pages/Volunteer';
import { ToastContainer, toast } from 'react-toastify'
import ClubDashboard from './pages/ClubDashboard';
import 'react-toastify/dist/ReactToastify.css'
import AddPatient from './pages/Addpatient';
import MedicineDetails from "./pages/MedicineDetails";
import VolunteerPage from './pages/Volunteerpage';
import VolunteerProfile from './pages/Volunteerprofile';
import BuyMed from "./pages/BuyMed"
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>  
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/easy-med" element={<EasyMed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<Myprofile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointments/:docId" element={<Appointment />} />
        <Route path="/welfareclubs" element={<Welfareclubs />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/club-dashboard" element={<ClubDashboard />} />
        <Route path="/add-patient" element={<AddPatient/>} />
        <Route path="/medicines/:type" element={<EasyMed />} />
        
        <Route path="/medicines/:id" element={<MedicineDetails />} />
        <Route path="/volunteerpage" element={<VolunteerPage />} />
        <Route path="/volunteerprofile" element={<VolunteerProfile />} />
        <Route path="/buymed" element={<BuyMed />} />
        <Route path="/buymed/:id" element={<BuyMed />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
