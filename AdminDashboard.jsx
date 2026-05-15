import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/appointsets/Backend/api/get_admin_stats.php")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-state">Loading Analytics...</div>;
  if (!data) return <div className="error-state">Check backend connection.</div>;

  return (
    <AdminLayout>
      <div className="dashboard-full-container">
        
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-info">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {data.admin_name.split(' ')[0]}!</p>
          </div>
          <div className="header-btns">
            <button className="btn-add">+ New Appointment</button>
            <button className="btn-export">Export Data</button>
          </div>
        </header>

        {/* Stats Grid - Occupies full width */}
        <section className="stats-row">
          <StatBox title="Total Patients" value={data.total_patients} icon="👥" color="#1cb9d0" />
          <StatBox title="Today's Bookings" value={data.today_appointments} icon="📅" color="#2ecc71" />
          <StatBox title="Revenue" value={`₱${Number(data.revenue).toLocaleString()}`} icon="💰" color="#f1c40f" />
          <StatBox title="Pending" value="4" icon="⏳" color="#e74c3c" />
        </section>

        {/* Charts Section - Expanded */}
        <div className="charts-grid">
          <div className="chart-wrapper line-chart-area">
            <div className="chart-header">
              <h3>Appointment Trends</h3>
              <select className="chart-select">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="chart-canvas">
              <Line 
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: { y: { beginAtZero: true } }
                }}
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  datasets: [{
                    label: 'Appointments',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: '#1cb9d0',
                    backgroundColor: 'rgba(28, 185, 208, 0.1)',
                    fill: true,
                    tension: 0.4
                  }]
                }} 
              />
            </div>
          </div>

          <div className="chart-wrapper doughnut-area">
            <div className="chart-header">
              <h3>Service Distribution</h3>
            </div>
            <div className="chart-canvas">
              <Doughnut 
                data={{
                  labels: data.chart_data?.labels || [],
                  datasets: [{
                    data: data.chart_data?.counts || [],
                    backgroundColor: ['#c5a043', '#1cb9d0', '#3498db', '#2ecc71']
                  }]
                }}
                options={{ 
                  plugins: { legend: { position: 'bottom' } }, 
                  maintainAspectRatio: false,
                  responsive: true
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-full-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 25px;
          padding: 10px 0; /* Minimal internal padding */
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5px;
        }

        .header-info h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #2d3748;
          margin: 0;
        }

        .header-info p {
          color: #718096;
          margin: 5px 0 0 0;
        }

        .header-btns {
          display: flex;
          gap: 12px;
        }

        .btn-add, .btn-export {
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-add { background: #1cb9d0; color: white; }
        .btn-export { background: #c5a043; color: white; }
        .btn-add:hover, .btn-export:hover { transform: translateY(-2px); }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* Forced 4 columns for wide view */
          gap: 20px;
          width: 100%;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr; /* Larger ratio for trend chart */
          gap: 20px;
          width: 100%;
        }

        .chart-wrapper {
          background: white;
          border-radius: 24px;
          padding: 30px;
          border: 1px solid #edf2f7;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .chart-canvas {
          height: 450px; /* Increased height for full-screen feel */
          width: 100%;
        }

        @media (max-width: 1400px) {
          .stats-row { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        }

        @media (max-width: 1100px) {
          .charts-grid { grid-template-columns: 1fr; }
          .chart-canvas { height: 350px; }
        }
      `}</style>
    </AdminLayout>
  );
};

const StatBox = ({ title, value, icon, color }) => (
  <div className="stat-card">
    <div className="stat-content">
      <span className="stat-label">{title}</span>
      <h2 className="stat-number">{value}</h2>
    </div>
    <div className="stat-icon-circle" style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    <style>{`
      .stat-card {
        background: white;
        padding: 30px;
        border-radius: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #edf2f7;
      }
      .stat-label {
        color: #a0aec0;
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
        display: block;
      }
      .stat-number {
        font-size: 2.2rem;
        color: #2d3748;
        margin: 0;
        font-weight: 900;
      }
      .stat-icon-circle {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
      }
    `}</style>
  </div>
);

export default AdminDashboard;