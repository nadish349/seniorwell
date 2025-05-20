import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route,Routes } from 'react-router-dom';
import AllAppointments from './pages/Admin/AllAppointments';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Addmedicine from './pages/Admin/Addmedicine';
import MedicinesList from './pages/Admin/MedicinesList';


const App = () => {

   const  {aToken}= useContext(AdminContext)
  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorsList/>}/>
          <Route path='/add-medicine' element={<Addmedicine/>}/>
          <Route path='/all-medicines' element={<MedicinesList/>}/>
          
          
        </Routes>
      </div>
    </div>
  ) :(
    <>
    <Login/>
    <ToastContainer />
    </>
  )
}

export default App