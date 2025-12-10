import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 

import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import About from "./Component/About/About";
import Footer from "./Component/Footer";
import ProtectedRoute from "./Component/ProtectedRoute";

import Contact from "./Component/Contact/Contact";
import AdmissionForm from "./Component/AdmissionForm";


import AdminDashboard from "./pages/Admin/AdminDashboard";
import Courses from "./Component/Course";
import Gallery from "./Component/Gallery";
import Activities from "./Component/Activities";
import Teacher from "./Component/Teacher";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";

function App() {
  return (
    
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-all duration-300">
  
        <Routes>
        
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />

          <Route
            path="/course"
            element={
              <>
                <Navbar />
                <Courses/>
                <Footer />
              </>
            }
          />

          <Route
            path="/gallery"
            element={
              <>
                <Navbar />
                <Gallery/>
                <Footer />
              </>
            }
          />

          <Route
            path="/activities"
            element={
              <>
                <Navbar />
                <Activities/>
                <Footer />
              </>
            }
          />

          <Route
            path="/teacher"
            element={
              <>
                <Navbar />
                <Teacher/>
                <Footer />
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />

          <Route
            path="/admissionform"
            element={
              <>
                <Navbar/>
                <AdmissionForm/>
                <Footer />
              </>
            }
          /> 

          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <LoginPage />
                <Footer />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
                <Footer />
              </>
            }
          />

        
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/CandidateDashboard"
            element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard/>
              </ProtectedRoute>
            }
          />

         

          
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        
      </div>
    
  );
}

export default App;