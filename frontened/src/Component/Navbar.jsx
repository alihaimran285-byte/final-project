import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/pandalogo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // ✅ Navigation items (Login/Signup excluded)
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/admissionform", label: "Admission Form" },
    
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-orange-400/80 shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-16 w-20 object-contain drop-shadow-lg hover:scale-110 transition duration-300"
          />
          <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-sm">
            Panda School
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center font-semibold text-lg">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `relative group transition px-3 py-2 rounded-lg ${
                  isActive 
                    ? "text-yellow-200 bg-orange-600/30 font-bold" 
                    : "text-white hover:bg-orange-500/30"
                }`
              }
            >
              {item.label}
              <span className="absolute left-3 right-3 -bottom-1 h-[2px] bg-white rounded-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </NavLink>
          ))}
        </div>

        {/* ✅ Login/Signup Buttons (Right Side) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="bg-white/90 text-orange-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-orange-700 px-5 py-2 rounded-xl text-white font-semibold shadow-md hover:bg-orange-800 hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl bg-orange-600/30 p-2 rounded-lg hover:bg-orange-600/50 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-orange-400/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-3 text-white font-semibold">
          {/* Navigation Links */}
          {navItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.path} 
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `py-3 px-4 rounded-lg transition ${
                  isActive 
                    ? "text-yellow-200 bg-orange-600/30 font-bold" 
                    : "hover:bg-orange-500/30"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* ✅ Mobile Login/Signup Buttons */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-orange-300/50">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="bg-white text-orange-600 px-4 py-3 rounded-xl shadow-md flex-1 text-center font-semibold hover:scale-105 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="bg-orange-700 text-white px-4 py-3 rounded-xl shadow-md flex-1 text-center font-semibold hover:bg-orange-800 hover:scale-105 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}