import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const Footer = () => {
  return (
    <div className='mx-16 mt-32'>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        {/* Left */}
        <div>
          <img className="mb-4 w-20" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-4">
            At Seniorwell, we are committed to your success in maintaining a healthy and fulfilling life. Our dedicated team and comprehensive services are here to ensure quality care for every step of your journey. Because your well-being is our priority.
          </p>
        </div>
        {/* Center */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/* Right */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>9544024242</li>
            <li>nadishash7@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* Copyright Text */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © 2024 SENIORWELL - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
