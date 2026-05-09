import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "../assets/logo.jpg";

const Signup = () => {
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    contact_num: '',
    address: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost/appointsets/Backend/api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setError('');
        navigate('/login');
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    /* 1. Full Screen Wrapper (Matches Login) */
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#b7e4d9] to-[#fefbe0] font-sans p-6">
      
      {/* 2. Signup Card (Powder Blue) */}
      <div className="bg-[#B8CFEB] w-full max-w-[500px] p-8 md:p-10 rounded-[50px] shadow-2xl text-center">
        
        {/* 3. Logo */}
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
          <img src={logoImg} alt="Logo" className="w-4/5 object-contain" />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          
          {/* Grid for Name and Age to save vertical space */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 text-left">
              <input 
                type="text" name="full_name" placeholder="Full Name" 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
                value={formData.full_name} onChange={handleChange} required 
              />
            </div>
            <div className="text-left">
              <input 
                type="number" name="age" placeholder="Age" min="3" 
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
                value={formData.age} onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="text-left">
            <input 
              type="tel" name="contact_num" placeholder="Contact Number" 
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
              value={formData.contact_num} onChange={handleChange} required 
            />
          </div>

          <div className="text-left">
            <input 
              type="text" name="address" placeholder="Address" 
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
              value={formData.address} onChange={handleChange} required 
            />
          </div>

          <div className="text-left">
            <input 
              type="email" name="email" placeholder="Email" 
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
              value={formData.email} onChange={handleChange} required 
            />
          </div>

          {/* Password Fields */}
          <div className="text-left relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" placeholder="Password" 
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
              value={formData.password} onChange={handleChange} required 
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Password Rules (Styled to be subtle) */}
          <div className="text-[10px] text-gray-600 flex justify-between px-2 text-left leading-tight">
            <p>• 8-12 Characters</p>
            <p>• Uppercase & Lowercase</p>
            <p>• Special Character</p>
          </div>

          <div className="text-left relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirm_password" placeholder="Confirm Password" 
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1cb9d0] outline-none"
              value={formData.confirm_password} onChange={handleChange} required 
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer select-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "🙈" : "👁"}
            </span>
          </div>

          {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}

          <button type="submit" className="w-full py-4 bg-[#1cb9d0] text-white font-bold text-xl rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg mt-2">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;