import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';

const Step2 = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [period, setPeriod] = useState("AM");
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    if (!localStorage.getItem("selectedService")) {
      navigate("/BookAppointment");
    }
  }, [navigate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day, isSunday) => {
    // 1. Prevent selection if it's Sunday
    if (isSunday) return;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Please choose preferred date and time");
    } else {
      localStorage.setItem("selectedDate", selectedDate);
      localStorage.setItem("selectedTime", selectedTime);
      navigate("/Step3");
    }
  };

  const timeSlots = {
    AM: ["8:00", "9:00", "10:30"],
    PM: ["1:00", "2:00", "3:30"]
  };

  return (
    <Layout userName={userName}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center pb-4 border-b-4 border-gray-100 gap-5 mb-10 overflow-hidden">
          <span className="text-[#c5a043] font-extrabold text-lg opacity-30">Select Service</span>
          <span className="text-[#c5a043] font-extrabold text-lg border-b-2 border-[#c5a043]">Set date and time</span>
          <span className="text-[#c5a043] font-extrabold text-lg opacity-30">Confirm details</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your plan date?</h2>
            <div className="h-[1px] bg-gray-300 w-full mb-6"></div>
            
            <div className="bg-gray-50 p-6 rounded-3xl shadow-inner border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <button type="button" onClick={handlePrevMonth} className="text-2xl font-bold text-[#c5a043]">◀</button>
                <h3 className="text-xl font-black">{monthNames[currentMonth]} {currentYear}</h3>
                <button type="button" onClick={handleNextMonth} className="text-2xl font-bold text-[#c5a043]">▶</button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-500 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateString;
                  
                  // 2. Check if the current day being rendered is a Sunday
                  const isSunday = new Date(currentYear, currentMonth, day).getDay() === 0;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day, isSunday)}
                      className={`py-3 rounded-xl font-bold transition-all text-center
                        ${isSunday 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' // 3. Grayed out style
                          : isSelected 
                            ? 'bg-gradient-to-b from-[#faffd1] to-[#e1e9b7] border-2 border-[#c5a043] translate-y-1 shadow-inner cursor-pointer' 
                            : 'bg-white hover:bg-gray-100 shadow-sm border-2 border-transparent cursor-pointer'}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[350px]">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Set your Time</h2>
            <div className="h-[1px] bg-gray-300 w-full mb-6"></div>

            <div className="flex justify-center gap-4 mb-8">
              {['AM', 'PM'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPeriod(p); setSelectedTime(""); }}
                  className={`px-8 py-2 rounded-full font-black transition-all border-2 
                    ${period === p ? 'bg-[#1cb9d0] text-white border-transparent' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {timeSlots[period].map(t => {
                const fullTime = `${t} ${period}`;
                const isSelected = selectedTime === fullTime;

                return (
                  <div
                    key={t}
                    onClick={() => { setSelectedTime(fullTime); setError(""); }}
                    className={`py-4 rounded-full text-center font-extrabold cursor-pointer transition-all shadow-md
                      ${isSelected 
                        ? 'bg-gradient-to-b from-[#faffd1] to-[#e1e9b7] border-2 border-[#c5a043] translate-y-1' 
                        : 'bg-[#e0e0e0] border-2 border-transparent text-gray-700'}`}
                  >
                    {t}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[#ffe5e5] text-[#d8000c] p-4 rounded-xl text-center font-bold border border-[#ffb3b3]">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-5">
          <button type="button" onClick={() => navigate("/BookAppointment")} className="bg-[#1cb9d0] text-white px-16 py-4 rounded-full font-bold text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
            Prev
          </button>
          <button type="submit" className="bg-[#1cb9d0] text-white px-16 py-4 rounded-full font-bold text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Step2;