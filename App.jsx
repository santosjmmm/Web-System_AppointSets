import { Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import BookAppointment from './pages/BookAppointment';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3'; 
import Step4 from './pages/Step4';
import Success from './pages/Success';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Appointment Booking Stepper */}
      <Route path="/BookAppointment" element={<BookAppointment />}/>
      <Route path="/Step2" element={<Step2 />} />
      <Route path="/Step3" element={<Step3 />} />
      <Route path="/Step4" element={<Step4 />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;