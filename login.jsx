import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "../assets/logo.jpg"; 

const Login = () => {
  const navigate = useNavigate();
  
  // State Declarations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/appointsets/Backend/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        // ✅ CRITICAL FIX: Save the name and ID to localStorage
        // This allows Layout.jsx to find "userName" instead of defaulting to "Guest"
        localStorage.setItem("userName", data.name);
        localStorage.setItem("patient_id", data.patient_id);
        localStorage.setItem("userRole", data.role);
        
        navigate("/BookAppointment");
      } else {
        setError(data.message);
        if (data.message.includes("Too many attempts")) {
          const seconds = parseInt(data.message.match(/\d+/)?.[0]);
          if (seconds) setRemainingTime(seconds);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#b7e4d9] to-[#fefbe0] font-sans p-4">
      <div className="bg-[#B8CFEB] w-full max-w-[400px] p-10 rounded-[50px] shadow-2xl text-center">
        <div className="w-28 h-28 bg-white rounded-full mx-auto mb-8 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
          <img src={logoImg} alt="C'Smiles Logo" className="w-4/5 object-contain" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-gray-700 text-xs mb-1 ml-4 uppercase tracking-wider">Email</label>
            <input
              type="email"
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="text-left relative">
            <label className="block text-gray-700 text-xs mb-1 ml-4 uppercase tracking-wider">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-5 top-[38px] cursor-pointer text-lg select-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
          {remainingTime > 0 && <div className="text-orange-500 text-sm">Lockout: {remainingTime}s</div>}

          <button 
            type="submit" 
            className="w-full py-4 bg-[#1cb9d0] text-white font-bold text-xl rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg mt-4 disabled:bg-gray-300"
            disabled={remainingTime > 0}
          >
            Log In
          </button>
        </form>

        <div className="mt-8 text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;