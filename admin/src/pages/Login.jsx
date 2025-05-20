import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // 🔹 Check if fields are empty before making the request
    if (!email.trim() || !password.trim()) {
      return toast.error("Email and Password are required!");
    }

    console.log("Submitting Login Request...");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { 
          email, 
          password 
        });

        if (data.success) {
          console.log("Token:", data.token);
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message || "Login failed!");
        }
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Network Error. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>

        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span className="text-primary underline cursor-pointer" onClick={() => setState('Doctor')}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span className="text-primary underline cursor-pointer" onClick={() => setState('Admin')}>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
