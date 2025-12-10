import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserCircle, GraduationCap, ArrowLeft } from "lucide-react";
import panda from "../assets/panda-cut.png";

export default function Register() {
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Admin registration form
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin"
  });

  // Candidate registration form
  const [candidateData, setCandidateData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "candidate"
  });

  // Email verification states
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  // Step 1: Select role
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg("");
    setSuccessMsg("");
    setStep(2);
  };

  // Step 2: Admin Registration
  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!adminData.name || !adminData.email || !adminData.password) {
      setErrorMsg("All fields are required");
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (adminData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg("✅ Admin registration successful! Redirecting to login page...");
        
        // Clear form
        setAdminData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "admin"
        });

        // Auto redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMsg(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg("Could not connect to server. Please try again.");
    }

    setLoading(false);
  };

  // Step 2.1: Check candidate email
  const checkCandidateEmail = async () => {
    if (!candidateData.email) {
      setErrorMsg("Please enter email");
      return;
    }

    setEmailChecking(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:3000/api/candidates/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: candidateData.email })
      });

      const data = await response.json();

      if (data.success) {
        setEmailVerified(true);
        setStudentInfo(data.student);
        setCandidateData(prev => ({ ...prev, name: data.student.name }));
        setSuccessMsg("✅ Email verified! Please complete registration.");
      } else {
        setErrorMsg(data.message || "❌ Email not found in system. Please contact admin.");
      }
    } catch (err) {
      console.error("Email check error:", err);
      setErrorMsg("Could not connect to server. Please try again.");
    }

    setEmailChecking(false);
  };

  // Step 2.2: Candidate Registration
  const handleCandidateRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!candidateData.name || !candidateData.email || !candidateData.password) {
      setErrorMsg("All fields are required");
      return;
    }

    if (candidateData.password !== candidateData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (candidateData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/candidates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg("✅ Registration successful! Redirecting to login page...");
        
        // Clear form
        setCandidateData({
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
          phone: "",
          role: "candidate"
        });
        
        setEmailVerified(false);
        setStudentInfo(null);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg("Could not connect to server. Please try again.");
    }

    setLoading(false);
  };

  // Back to role selection
  const handleBack = () => {
    setStep(1);
    setRole("");
    setErrorMsg("");
    setSuccessMsg("");
    setEmailVerified(false);
    setStudentInfo(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fcd4ab] to-[#f8b6a3] p-4 md:p-6 mt-10">
      <div className="flex flex-col lg:flex-row gap-5lg:gap-10 items-center justify-center max-w-6xl w-full">
    
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-2xl order-2 lg:order-1">
          
          {step === 1 && (
            <>
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">REGISTER</h2>
                <p className="text-gray-600 text-sm md:text-base">Select your role to continue</p>
              </div>
              
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium text-center">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect("admin")}
                  className="w-full p-4 md:p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <UserCircle className="w-7 h-7 md:w-8 md:h-8" />
                    <div className="text-left">
                      <div className="text-lg md:text-xl font-bold">Admin</div>
                      <div className="text-xs md:text-sm opacity-90">School Administrator</div>
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => handleRoleSelect("candidate")}
                  className="w-full p-4 md:p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <GraduationCap className="w-7 h-7 md:w-8 md:h-8" />
                    <div className="text-left">
                      <div className="text-lg md:text-xl font-bold">Candidate / Student</div>
                      <div className="text-xs md:text-sm opacity-90">Registered by Admin</div>
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm md:text-base">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Step 2: Admin Registration Form */}
          {step === 2 && role === "admin" && (
            <>
              <div className="flex items-center mb-4 md:mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm md:text-base"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  Back
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Admin Registration</h2>

              {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium text-center">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium text-center">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleAdminRegister}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Full Name</label>
                    <input
                      type="text"
                      value={adminData.name}
                      onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Email</label>
                    <input
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={adminData.password}
                        onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                        placeholder="Create a password (min 6 characters)"
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={adminData.confirmPassword}
                        onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Candidate Registration */}
          {step === 2 && role === "candidate" && (
            <>
              <div className="flex items-center mb-4 md:mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm md:text-base"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  Back
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Candidate Registration</h2>

              {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium text-center">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium text-center">{successMsg}</p>
                </div>
              )}

              {/* Step 2.1: Check Email */}
              {!emailVerified ? (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      ⚠️ Important
                    </h3>
                    <p className="text-sm text-orange-700">
                      You must have been added to the system by Admin first. Use the email provided by admin.
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">School Email</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={candidateData.email}
                        onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                        placeholder="Enter your school email"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                      />
                      <button
                        type="button"
                        onClick={checkCandidateEmail}
                        disabled={emailChecking}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 disabled:opacity-50 font-semibold whitespace-nowrap text-sm md:text-base"
                      >
                        {emailChecking ? "Checking..." : "Verify"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Example: aarav.sharma@school.com
                    </p>
                  </div>
                </div>
              ) : (
                /* Step 2.2: Complete Registration */
                <form onSubmit={handleCandidateRegister}>
                  {studentInfo && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">✅ Email Verified!</h3>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Student:</strong> {studentInfo.name}</p>
                        <p><strong>Class:</strong> {studentInfo.class} | <strong>Roll No:</strong> {studentInfo.rollNo}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Full Name</label>
                      <input
                        type="text"
                        value={candidateData.name}
                        onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                        placeholder="Enter your full name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Email (Verified)</label>
                      <input
                        type="email"
                        value={candidateData.email}
                        readOnly
                        className="w-full p-3 border border-gray-300 bg-gray-50 rounded-lg cursor-not-allowed text-sm md:text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">This email is verified and cannot be changed</p>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={candidateData.phone}
                        onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                        placeholder="Enter your phone number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={candidateData.password}
                          onChange={(e) => setCandidateData({...candidateData, password: e.target.value})}
                          placeholder="Create a password (min 6 characters)"
                          className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={candidateData.confirmPassword}
                          onChange={(e) => setCandidateData({...candidateData, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Panda Image - Right side on desktop, above on mobile */}
        <div className="order-1 lg:order-2 flex justify-center lg:block">
          <img 
            src={panda} 
            alt="panda mascot" 
            className="h-[250px] md:h-[300px] lg:h-[350px] w-auto object-contain" 
          />
        </div>
      </div>
    </div>
  );
}