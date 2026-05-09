import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import Layout from '../components/layout';
import "../styles/layout.css";
// import logoImg from "../assets/logo.jpg"; // Keep if used elsewhere

const BookAppointment = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [formData, setFormData] = useState({ service: '', dentist: '' });
  const [error, setError] = useState('');

  const services = ["Cleaning", "Restorative", "Extraction", "Orthodontics", "Endodontics", "Dentures"];
  const dentists = ["Dra. Camaclang", "Dr. Calimbahin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Move preventDefault to the top to handle validation
    
    if (!formData.service || !formData.dentist) {
      setError("Please choose service and dentist");
    } else {
      setError('');
      
      // 3. Save to localStorage so Step 2 can read it
      localStorage.setItem("selectedService", formData.service);
      localStorage.setItem("selectedDentist", formData.dentist);
      
      // 4. Proceed to Step 2
      navigate('/Step2');
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="stepper-head">
          <span style={{ textDecoration: 'underline' }}>Select Service</span>
          <span className="inactive">Set date and time</span>
          <span className="inactive">Confirm details</span>
          <span className="inactive">Done</span>
        </div>

        <h2>What's your plan today?</h2>
        <div className="divider"></div>
        <div className="pill-grid">
          {services.map(s => (
            <label key={s} className="pill-option">
              {/* Added 'checked' logic so the UI stays in sync */}
              <input 
                type="radio" 
                name="service" 
                value={s} 
                onChange={handleChange} 
                checked={formData.service === s}
              />
              <div className="pill-label">{s}</div>
            </label>
          ))}
        </div>

        <h2>Who's your Dentist?</h2>
        <div className="divider"></div>
        <div className="dentist-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '70%' }}>
          {dentists.map(d => (
            <label key={d} className="pill-option">
              <input 
                type="radio" 
                name="dentist" 
                value={d} 
                onChange={handleChange} 
                checked={formData.dentist === d}
              />
              <div className="pill-label">{d}</div>
            </label>
          ))}
        </div>

        {error && <div className="error-box" style={{ display: 'block' }}>{error}</div>}

        <div className="footer-action">
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default BookAppointment;