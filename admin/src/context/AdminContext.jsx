import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);  // ✅ Medicines state
  const [appointments,setAppointments]= useState([])
  const [dashData, setDashData] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Fetch All Doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, { headers: { aToken } });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Change Doctor Availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Fetch All Medicines
  const getAllMedicines = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-medicines`, { headers: { aToken } });
      if (data.success) {
        setMedicines(data.medicines);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Change Medicine Availability
  const changeMedicineAvailability = async (medId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-medicine-availability`, { medId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllMedicines();  // ✅ Refresh medicine list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Clear token on refresh
  useEffect(() => {
    localStorage.removeItem('aToken');
    setAToken('');
  }, []);



  const getAllAppointments = async()=>{
    try {
       const {data}= await axios.get(backendUrl+ '/api/admin/appointments',{headers:{aToken}})

     if (data.success) {
       setAppointments(data.appointments)
       console.log(data.appointments);

     }   else{
      toast.error(data.message)
     }

    } catch (error) {
      toast.error(data.message)
    }
  }

const cancelAppointment =async(appointmentId)=>{

  try {
       const {data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
     
       if (data.success){
        toast.error(data.message)
        getAllAppointments()

        
       } else {
        toast.error(data.message)
       }




  } catch (error) {
    toast.error(data.message)
  }

}

// Getting Admin Dashboard data from Database using API
const getDashData = async () => {
  try {

      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

      if (data.success) {
          setDashData(data.dashData)
      } else {
          toast.error(data.message)
      }

  } catch (error) {
      console.log(error)
      toast.error(error.message)
  }

}


  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    medicines,                   // ✅ Medicines state
    getAllMedicines,             // ✅ Fetch all medicines
    changeMedicineAvailability,  // ✅ Toggle medicine availability
    appointments,setAppointments,
     getAllAppointments,
     cancelAppointment,
     getDashData,
      dashData
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
