
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import panda from "../assets/panda-cut.png";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    role: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user.email || !user.role || !user.password) {
      setErrorMsg("Email, password and role are required.");
      return;
    }

    setLoading(true);

    try {
      let endpoint = '';
      let requestBody = {};
      
      if (user.role === 'admin') {
        endpoint = "http://localhost:3000/auth/login";
        requestBody = {
          email: user.email,
          password: user.password,
          role: 'admin'
        };
      } else if (user.role === 'candidate') {
        endpoint = "http://localhost:3000/api/candidates/login";
        requestBody = {
          email: user.email,
          password: user.password
        };
      } else {
        setErrorMsg("Invalid role selected");
        setLoading(false);
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || "Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ EXACTLY 5 SECONDS KA LOADING
      if (user.role === "admin") {
        // Sabse pehle dashboard data prefetch karo
        const prefetchPromise = fetchDashboardData();
        
        // 5 seconds ka timer start karo
        const loadingStartTime = Date.now();
        const minimumLoadingTime = 5000; // 5 seconds
        
        prefetchPromise.then(() => {
          const elapsedTime = Date.now() - loadingStartTime;
          const remainingTime = minimumLoadingTime - elapsedTime;
          
          if (remainingTime > 0) {
            // Agar 5 seconds se kam time laga, to baki ka wait karo
            setTimeout(() => {
              navigate("/AdminDashboard");
              setLoading(false);
            }, remainingTime);
          } else {
            // Agar 5 seconds se zyada time laga, to immediately navigate
            navigate("/AdminDashboard");
            setLoading(false);
          }
        }).catch(() => {
          // Error case mein bhi 5 seconds ka wait
          setTimeout(() => {
            navigate("/AdminDashboard");
            setLoading(false);
          }, minimumLoadingTime);
        });
        
      } else if (user.role === "candidate") {
        // Candidate ke liye bhi 5 seconds ka wait
        setTimeout(() => {
          navigate("/CandidateDashboard");
          setLoading(false);
        }, 5000);
      }

    } catch (err) {
      setErrorMsg("Could not connect to server. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Dashboard data prefetch function
  const fetchDashboardData = async () => {
    try {
      // Essential data prefetch karo
      const endpoints = [
        'http://localhost:3000/api/admin/dashboard',
        'http://localhost:3000/api/students?limit=5',
        'http://localhost:3000/api/teachers?limit=5'
      ];
      
      await Promise.all(
        endpoints.map(endpoint => 
          fetch(endpoint).then(res => res.json()).then(data => {
            // Data ko localStorage mein save karo for quick access
            if (endpoint.includes('/admin/dashboard')) {
              localStorage.setItem('prefetchedDashboardStats', JSON.stringify(data));
            } else if (endpoint.includes('/students')) {
              localStorage.setItem('prefetchedStudents', JSON.stringify(data.data || data));
            } else if (endpoint.includes('/teachers')) {
              localStorage.setItem('prefetchedTeachers', JSON.stringify(data.data || data));
            }
          })
        )
      );
      
      console.log('✅ Dashboard data prefetched successfully');
    } catch (error) {
      console.log('⚠️ Prefetching failed, will load normally');
      // Prefetching fail hone par bhi continue karo
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fcd4ab] to-[#f8b6a3]  md:p-6 mt-20">
      <div className="flex flex-col lg:flex-row gap-4lg:gap-10 items-center justify-center max-w-6xl w-full">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-2xl order-2 lg:order-1">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">LOGIN</h2>
            <p className="text-gray-600 text-sm md:text-base">Welcome back! Please login to continue</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium text-center">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Select Role:</label>
                <select
                  name="role"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                  value={user.role}
                  onChange={changeHandler}
                  required
                >
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="candidate">Candidate / Student</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                  value={user.email}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Password:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm md:text-base"
                    value={user.password}
                    onChange={changeHandler}
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
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in... Please wait 5 seconds
                </div>
              ) : 'Login'}
            </button>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:block ">
          <img 
            src={panda} 
            alt="panda mascot" 
            className="h-[270px] md:h-[300px] lg:h-[350px] w-auto object-contain" 
          />
        </div>
      </div>
    </div>
  );
}