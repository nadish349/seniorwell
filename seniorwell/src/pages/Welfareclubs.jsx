import React, { useContext, useState } from 'react';
import { Appcontext } from '../context/Appcontext'; // Ensure the context is correctly imported
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ClubLogin = () => {
  const { backendUrl, token, setToken } = useContext(Appcontext);
  const [state, setState] = useState('Sign Up'); // Toggle between Sign Up and Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate(); // To redirect after login

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      let data;
      if (state === 'Sign Up') {
        // Register the club
        const response = await axios.post(`${backendUrl}/api/club/register`, { name, email, password });
        data = response.data;
      } else {
        // Login the club
        const response = await axios.post(`${backendUrl}/api/club/login`, { email, password });
        data = response.data;
      }
  
      if (data.success) {
        localStorage.setItem('token', data.token); // Save token
        localStorage.setItem('clubId', data.clubId); // Save clubId
        setToken(data.token); // Update token in context
  
        toast.success(state === 'Sign Up' ? 'Club registered successfully!' : 'Login Successful!');
        
        // Redirect to the club dashboard
        navigate('/club-dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  

  // If the club is already logged in, hide the login form
  if (token) {
    return <p className="text-center text-lg text-green-600 mt-10">You're already logged in.</p>;
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8'
      >
        {/* Title */}
        <div className='text-center mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
            {state === 'Sign Up' ? 'Create Club Account' : 'Club Login'}
          </h2>
          <p className='text-sm sm:text-base text-gray-600 mt-2'>
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to manage your club.
          </p>
        </div>

        {/* Name Field (Only for Sign-Up) */}
        {state === 'Sign Up' && (
          <div className='mb-4'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Club Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Enter your club name'
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
            placeholder='Enter your email'
              required
            />
          </div>

          {/* Password Field */}
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Enter your password'
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light'
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>

          {/* Toggle between Sign-Up and Login */}
          <div className='mt-4 text-center'>
            <p className='text-sm sm:text-base text-gray-600'>
              {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span
                className='text-primary font-medium cursor-pointer'
                onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
              >
                {state === 'Sign Up' ? 'Log in' : 'Sign up'}
              </span>
            </p>
          </div>
        </form>
      </div>
    );
  };

  export default ClubLogin;