import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import "../styles/layout.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the PHP API
    fetch("http://localhost/appointsets/Backend/api/get_services.php")
      .then(response => response.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  const handleBookNow = (serviceId) => {
    // Navigates to BookAppointment and passes the service_id via URL
    navigate(`/BookAppointment?service_id=${serviceId}`);
  };

  return (
    <Layout>
      <div className="services-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '30px', marginTop: '0', color: '#c5a043' }}>
          Our Services
        </h1>

        <div className="services-list" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '25px', 
          overflowY: 'auto', 
          paddingRight: '15px', 
          paddingBottom: '20px' 
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: 'span 2' }}>Loading services...</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div key={service.service_id} className="service-item" style={{
                display: 'flex',
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                alignItems: 'flex-start',
                gap: '20px'
              }}>
                {/* Service Image */}
                <div 
                  style={{
                    width: '130px',
                    height: '130px',
                    backgroundImage: `url(${service.service_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    flexShrink: 0,
                    backgroundColor: '#eee'
                  }}
                ></div>

                {/* Service Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
                  <div className="service-info">
                    <h3 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '1.1rem', color: '#333' }}>
                      {service.service_name}
                    </h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {service.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignWeight: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2a7a6e' }}>
                      ₱{Number(service.price).toLocaleString()}
                    </div>
                    <button 
                      onClick={() => handleBookNow(service.service_id)}
                      className="book-btn"
                      style={{
                        backgroundColor: '#a3e635',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '40px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: 'span 2' }}>No services currently available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Services;