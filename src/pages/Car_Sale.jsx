import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaGasPump,
  FaCog,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import "../style/Car.modules.css";
import "../style/Modal.modules.css";
import database from "../services/database";
import ImageCarousel from "../components/ImageCarousel";

function Car_Sale() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await database.getCars();
        setCars(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="cars-container">
        <div className="page-header">
          <h1>Cars for Sale</h1>
          <p>Loading cars from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-container">
        <div className="page-header">
          <h1>Cars for Sale</h1>
          <p style={{ color: "red" }}>Error: {error}</p>
          <p>Please check if the database file exists</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cars-container">
        <div className="page-header">
          <h1>Cars for Sale</h1>
          <p>Browse our selection of quality pre-owned and new vehicles</p>
        </div>

        <div className="cars-grid">
          {cars.map((car) => (
            <div
              key={car.id}
              className="car-card"
              onClick={() => setSelectedCar(car)}
            >
              <div className="car-image">
                <ImageCarousel
                  images={car.images || (car.image ? [car.image] : [])}
                  fallbackEmoji="🚗"
                  alt={car.title}
                />
              </div>
              <div className="car-details">
                <h2 className="car-title">{car.title}</h2>
                <div className="car-year">Year: {car.year}</div>
                <div className="car-specs">
                  <span>
                    <FaTachometerAlt /> {car.mileage}
                  </span>
                  <span>
                    <FaGasPump /> {car.fuel}
                  </span>
                  <span>
                    <FaCog /> {car.transmission}
                  </span>
                </div>
                <p className="car-description">{car.description}</p>
                <div className="car-price">{car.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCar && (
        <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedCar(null)}
            >
              <FaTimes />
            </button>
            <div className="modal-image">
              <ImageCarousel
                images={
                  selectedCar.images ||
                  (selectedCar.image ? [selectedCar.image] : [])
                }
                fallbackEmoji="🚗"
                alt={selectedCar.title}
              />
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{selectedCar.title}</h2>
              <div className="modal-section">
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <FaCalendarAlt />
                    <span>Year: {selectedCar.year}</span>
                  </div>
                  <div className="modal-info-item">
                    <FaTachometerAlt />
                    <span>{selectedCar.mileage}</span>
                  </div>
                  <div className="modal-info-item">
                    <FaGasPump />
                    <span>{selectedCar.fuel}</span>
                  </div>
                  <div className="modal-info-item">
                    <FaCog />
                    <span>{selectedCar.transmission}</span>
                  </div>
                </div>
              </div>
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedCar.description}</p>
                <p>
                  This vehicle is in excellent condition and has been
                  well-maintained. It comes with a clean title and has passed
                  all safety inspections. The car features modern amenities and
                  is ready for immediate use. Perfect for anyone looking for a
                  reliable and stylish vehicle.
                </p>
              </div>
              <div className="modal-section">
                <h3>Features</h3>
                <ul
                  style={{
                    color: "#555",
                    lineHeight: "2",
                    paddingLeft: "20px",
                  }}
                >
                  <li>Well-maintained with service records</li>
                  <li>Clean title and accident-free</li>
                  <li>Recent inspection completed</li>
                  <li>All original features included</li>
                  <li>Warranty available (contact for details)</li>
                  <li>Test drive available by appointment</li>
                </ul>
              </div>
              <div className="modal-price">{selectedCar.price}</div>
              <button
                className="modal-contact-btn"
                onClick={() => {
                  window.location.href = "/Contact";
                }}
              >
                Contact Us About This Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Car_Sale;
