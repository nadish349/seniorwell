import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import config from '../config/config.js';

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
    const currencySymbol = '₹';
    const backendUrl = config.backendUrl;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState('');
    const [medicines, setMedicines]= useState([]);
    const [userData, setUserData] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(false);
    



    // ✅ Fetch Doctors List
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response?.data?.message || "Failed to load doctors");
        }
    };

    // ✅ Load User Profile (GET request)
    const loadUserProfileData = async () => {
        if (!token) {
            setUserData(null);
            return;
        }

        setLoadingUserData(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { token: `${token}` }  // ✅ Fixed Authorization header
            });

            if (data.success) {
                setUserData({
                    ...data.userData,
                    address: data.userData.address || { line1: '', line2: '' }  // ✅ Ensures address always has default values
                });
            } else {
                toast.error(data.message);
                setUserData(null);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error(error.response?.data?.message || "Failed to load profile");
            setUserData(null);
        } finally {
            setLoadingUserData(false);
        }
    };

    // ✅ Update Profile (POST request)
    const updateUserProfileData = async (updatedData, image) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('phone', updatedData.phone);
            formData.append('address', JSON.stringify(updatedData.address || {}));  // ✅ Stringify address
            formData.append('gender', updatedData.gender);
            formData.append('dob', updatedData.dob);
            if (image) formData.append('image', image);

            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
                headers: {
                    token: `${token}`,  // ✅ Fixed Authorization header
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();  // ✅ Refresh user data after update
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
        updateUserProfileData,  // ✅ Exposing update function
        loadingUserData,
        getDoctorsData,
         // ✅ Exposing fetch functions for update use case
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        loadUserProfileData();
    }, [token]);

    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    );
};

export default AppcontextProvider;
