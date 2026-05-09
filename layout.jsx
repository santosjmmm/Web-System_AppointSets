import React, { useState, useEffect } from 'react'; // 1. Added useState and useEffect
import '../styles/layout.css';
import logoImg from '../assets/logo.jpg'; 

const Layout = ({ children }) => {
  // 2. State to hold the name from the database
  const [displayName, setDisplayName] = useState('Guest');

  useEffect(() => {
    // 3. Retrieve the name stored during login
    // Make sure your Login component uses: localStorage.setItem("userName", data.name);
    const storedName = localStorage.getItem("userName");
    
    if (storedName) {
      setDisplayName(storedName);
    }
  }, []); // Runs once on component mount

  return (
    <div className="page-wrapper">
      <header>
        <div className="brand">
          <div className="logo-circle">
            <img src={logoImg} alt="C'Smiles Logo" />
          </div>
          <div className="clinic-title">C'Smiles<span>Dental Center</span></div>
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          {/* 4. Clear storage on logout */}
          <a href="/login" onClick={() => localStorage.clear()} className="logout-link">Log out</a>
        </nav>
      </header>

      <aside>
        <div className="user-section">
          {/* 5. Display the retrieved name */}
          <div className="user-name">{displayName}</div>
          <div className="avatar-circle">👤</div>
        </div>
        
        <a href="/BookAppointment" className="nav-item active"><span>📋</span> Book Appointment</a>
        <a href="/appointments" className="nav-item"><span>📅</span> Appointments</a>
        <a href="/records" className="nav-item"><span>📂</span> Records</a>
        <a href="/rewards" className="nav-item"><span>🪙</span> Reward Points</a>
      </aside>

      <div className="main-content-area">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;