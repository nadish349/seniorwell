import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import { Appcontext } from '../context/Appcontext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, userData } = useContext(Appcontext);
  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
  };

  const [showMenu, setShowMenu] = useState(false); // State for mobile menu visibility

  // Hide navbar on WelfareClubs page
  if (location.pathname === "/club-dashboard") {
    return null;
  }

  if (location.pathname === "/volunteerpage") {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-500">
      <img
        className="w-15 cursor-pointer"
        src={assets.logo || '/fallback-logo.png'}
        alt="Logo"
        onClick={() => navigate('/')}
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li className="py-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold underline' : 'text-black'
            }
          >
            HOME
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold underline' : 'text-black'
            }
          >
            ALL DOCTORS
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/easy-med"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold underline' : 'text-black'
            }
          >
            EASY MED
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold underline' : 'text-black'
            }
          >
            ABOUT
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold underline' : 'text-black'
            }
          >
            CONTACT
          </NavLink>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          // Show Profile Dropdown when logged in
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer">
              <img className="w-8 rounded-full" src={userData.image} alt="" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            </div>
            <div className="absolute top-full mt-0 bg-white shadow-lg rounded-md p-2 w-48 text-gray-700 font-medium hidden group-hover:flex flex-col z-50">
              <p
                className="hover:text-black-100 px-4 py-2 cursor-pointer"
                onClick={() => navigate('/my-profile')}
              >
                My Profile
              </p>
              <p
                className="hover:text-black-100 px-4 py-2 cursor-pointer"
                onClick={() => navigate('/my-appointments')}
              >
                My Appointments
              </p>
              <p
                className="hover:text-black-100 px-4 py-2 cursor-pointer text-red-500"
                onClick={logout}
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          // Show Buttons when NOT logged in
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create Account
            </button>
            
            <button
              onClick={() => navigate('/volunteer')}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Volunteer
            </button>
          </>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* Mobile Menu */}
        {showMenu && (
          <div className="fixed inset-0 z-20 bg-white transition-all">
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-36" src={assets.logo} alt="" />
              <img
                className="w-7 cursor-pointer"
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt=""
              />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
              <li>
                <NavLink onClick={() => setShowMenu(false)} to="/">
                  <p className="px-4 py-2 rounded inline-block">HOME</p>
                </NavLink>
              </li>
              <li>
                <NavLink onClick={() => setShowMenu(false)} to="/doctors">
                  <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
                </NavLink>
              </li>
              <li>
                <NavLink onClick={() => setShowMenu(false)} to="/about">
                  <p className="px-4 py-2 rounded inline-block">ABOUT US</p>
                </NavLink>
              </li>
              <li>
                <NavLink onClick={() => setShowMenu(false)} to="/contact">
                  <p className="px-4 py-2 rounded inline-block">CONTACT</p>
                </NavLink>
              </li>
              {!token && (
                <>
                  <li>
                    <NavLink onClick={() => setShowMenu(false)} to="/volunteer">
                      <p className="px-4 py-2 rounded inline-block">VOLUNTEER</p>
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink onClick={() => setShowMenu(false)} to="/login">
                      <p className="px-4 py-2 inline-block bg-primary text-white rounded-full">
                        Create Account
                      </p>
                    </NavLink>
                  </li>
                </>
              )}
              {token && (
                <li>
                  <p
                    className="px-4 py-2 rounded inline-block text-red-500 cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </p>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
