import React, { useState, useContext } from 'react';
import { VolunteerContext } from '../context/VolunteerContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VolunteerLogin = () => {
  const { backendUrl, setToken } = useContext(VolunteerContext);
  const [state, setState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedOrganization = organization.trim();

    if (state === 'Sign Up' && (!trimmedEmail || !trimmedPassword || !trimmedOrganization)) {
      toast.error('All required fields must be filled!');
      return;
    }

    try {
      let data;
      if (state === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/volunteer/register`, {
          email: trimmedEmail,
          password: trimmedPassword,
          organization: trimmedOrganization || undefined, 
        });
        data = response.data;
      } else {
        const response = await axios.post(`${backendUrl}/api/volunteer/login`, {
          email: trimmedEmail,
          password: trimmedPassword,
        });
        data = response.data;
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Login Successful!');
        navigate('/volunteerpage'); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {state === 'Sign Up' ? 'Volunteer Registration' : 'Volunteer Login'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {state === 'Sign Up' ? 'Join us as a volunteer' : 'Log in to continue'}
          </p>
        </div>

        {state === 'Sign Up' && (
          <div className="mb-4">
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter your organization name"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-light"
        >
          {state === 'Sign Up' ? 'Sign Up' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-primary font-medium cursor-pointer"
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

export default VolunteerLogin;
