import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';

const Step4 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [summary, setSummary] = useState({
    name: localStorage.getItem("userName"),
    service: localStorage.getItem("selectedService"),
    dentist: localStorage.getItem("selectedDentist"),
    date: localStorage.getItem("selectedDate"),
    time: localStorage.getItem("selectedTime"),
  });

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    const appointmentPayload = {
      patient_id: localStorage.getItem("patient_id"),
      service: summary.service,
      dentist: summary.dentist,
      date: summary.date,
      time: summary.time
    };

    try {
      const response = await fetch("http://localhost/appointsets/Backend/api/create_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentPayload)
      });

      const data = await response.json();

      if (data.success) {
        // 1. Clear appointment data from storage
        localStorage.removeItem("selectedService");
        localStorage.removeItem("selectedDentist");
        localStorage.removeItem("selectedDate");
        localStorage.removeItem("selectedTime");
        
        // 2. Redirect to Success.jsx instead of /appointments
        navigate("/success"); 
      } else {
        setError(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const displayDate = summary.date 
    ? new Date(summary.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : "";

  return (
    <Layout>
      <main className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center pb-4 border-b-4 border-gray-100 gap-5 mb-10 overflow-hidden">
          <span className="text-[#c5a043] font-extrabold text-lg opacity-30">Select Service</span>
          <span className="text-[#c5a043] font-extrabold text-lg opacity-30">Set date and time</span>
          <span className="text-[#c5a043] font-extrabold text-lg opacity-30">Confirm details</span>
          <span className="text-[#c5a043] font-extrabold text-lg border-b-2 border-[#c5a043]">Confirm Appointment</span>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-center mb-8 text-gray-800">Appointment Summary</h2>
          
          {error && <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-center font-bold">{error}</div>}

          <div className="space-y-4 text-lg">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-bold">Patient Name:</span>
              <span className="font-black text-gray-800">{summary.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-bold">Service:</span>
              <span className="font-black text-gray-800">{summary.service}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-bold">Dentist:</span>
              <span className="font-black text-gray-800">{summary.dentist}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-bold">Schedule:</span>
              <span className="font-black text-gray-800">{displayDate} - {summary.time}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-12">
            <button 
              onClick={() => navigate("/Step3")}
              className="bg-[#1cb9d0] text-white px-16 py-4 rounded-full font-bold text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
              Prev
            </button>
            <button 
              onClick={handleConfirm}
              disabled={loading}
              className={`bg-[#1cb9d0] text-white px-16 py-4 rounded-full font-bold text-xl shadow-lg transition-all 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}`}>
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Step4;