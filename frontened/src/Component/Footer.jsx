import React from "react";
import { Link } from "react-router-dom"; // ✅ React Router import karo
import logo from "../assets/pandalogo.png";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-orange-300 to-orange-100 dark:from-gray-800 dark:to-gray-900 pt-14 pb-6 shadow-inner">
      
      {/* ✅ FIXED SVG PATH */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -mt-1">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 fill-orange-300 dark:fill-gray-700"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        
        {/* School Info */}
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <img
              src={logo}
              alt="Panda Logo"
              className="w-24 h-24 object-contain animate-bounce drop-shadow-xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-orange-900 dark:text-white mt-2">
            Panda School
          </h2>
          <p className="text-orange-700 dark:text-gray-300 text-sm mt-1">
            A friendly school for creative young minds.
          </p>
        </div>
        
        {/* Quick Links - ✅ FIXED */}
        <div>
          <h3 className="text-lg font-semibold text-orange-900 dark:text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-orange-700 dark:text-gray-300">
            <li>
              <Link to="/" className="hover:underline cursor-pointer block">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline cursor-pointer block">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/admissionform" className="hover:underline cursor-pointer block">
                Admissions
              </Link>
            </li>
            <li>
              <Link to="/Contact" className="hover:underline cursor-pointer block">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Academics */}
        <div>
          <h3 className="text-lg font-semibold text-orange-900 dark:text-white mb-3">
            Academics
          </h3>
          <ul className="space-y-2 text-orange-700 dark:text-gray-300">
            <li>
              <Link to="/course" className="hover:underline cursor-pointer block">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/teacher" className="hover:underline cursor-pointer block">
                Teachers
              </Link>
            </li>
            <li>
              <Link to="/activities" className="hover:underline cursor-pointer block">
                Activities
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:underline cursor-pointer block">
                Gallery
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-orange-900 dark:text-white mb-3">
            Contact
          </h3>
          <p className="text-orange-700 dark:text-gray-300">📍 Lahore, Pakistan</p>
          <p className="text-orange-700 dark:text-gray-300">📞 0300-1234567</p>
          <p className="text-orange-700 dark:text-gray-300">✉️ info@pandaschool.pk</p>

          <h4 className="text-md font-semibold text-orange-900 dark:text-white mt-4">
            Opening Hours
          </h4>
          <p className="text-orange-700 dark:text-gray-300 text-sm">
            Mon–Fri | 8:00am – 2:00pm
          </p>
        </div>
        
      </div>
      
      <div className="flex justify-center my-6">
        <div className="h-1 w-40 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
      </div>
      
      <p className="text-center text-sm text-orange-900 dark:text-gray-300">
        © {new Date().getFullYear()} Panda School • All Rights Reserved
      </p>
    </footer>
  );
}