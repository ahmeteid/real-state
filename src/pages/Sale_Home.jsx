import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
} from "react-icons/fa";
import "../style/Property.modules.css";
import "../style/Modal.modules.css";
import database from "../services/database";

function Sale_Home() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await database.getPropertiesForSale();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="properties-container">
        <div className="page-header">
          <h1>Homes for Sale</h1>
          <p>Loading properties from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties-container">
        <div className="page-header">
          <h1>Homes for Sale</h1>
          <p style={{ color: "red" }}>Error: {error}</p>
          <p>Please check if the database file exists</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="properties-container">
        <div className="page-header">
          <h1>Homes for Sale</h1>
          <p>Discover your dream home from our exclusive collection</p>
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <div
              key={property.id}
              className="property-card"
              onClick={() => setSelectedProperty(property)}
            >
              <div className="property-image">🏠</div>
              <div className="property-details">
                <h2 className="property-title">{property.title}</h2>
                <div className="property-location">
                  <FaMapMarkerAlt />
                  <span>{property.location}</span>
                </div>
                <div className="property-info">
                  <span>
                    <FaBed /> {property.bedrooms} Beds
                  </span>
                  <span>
                    <FaBath /> {property.bathrooms} Baths
                  </span>
                  <span>
                    <FaRulerCombined /> {property.area}
                  </span>
                </div>
                <p className="property-description">{property.description}</p>
                <div className="property-price">{property.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProperty && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProperty(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProperty(null)}
            >
              <FaTimes />
            </button>
            <div className="modal-image">🏠</div>
            <div className="modal-body">
              <h2 className="modal-title">{selectedProperty.title}</h2>
              <div className="modal-section">
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <FaMapMarkerAlt />
                    <span>{selectedProperty.location}</span>
                  </div>
                  <div className="modal-info-item">
                    <FaBed />
                    <span>{selectedProperty.bedrooms} Bedrooms</span>
                  </div>
                  <div className="modal-info-item">
                    <FaBath />
                    <span>{selectedProperty.bathrooms} Bathrooms</span>
                  </div>
                  <div className="modal-info-item">
                    <FaRulerCombined />
                    <span>{selectedProperty.area}</span>
                  </div>
                </div>
              </div>
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedProperty.description}</p>
                <p>
                  This beautiful property offers everything you need for modern
                  living. Located in a prime area with easy access to amenities,
                  schools, and transportation. The property features
                  high-quality finishes, spacious rooms, and excellent natural
                  light throughout.
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
                  <li>Modern kitchen with stainless steel appliances</li>
                  <li>Hardwood floors throughout</li>
                  <li>Central heating and air conditioning</li>
                  <li>Private parking space</li>
                  <li>Security system installed</li>
                  <li>Energy-efficient windows</li>
                </ul>
              </div>
              <div className="modal-price">{selectedProperty.price}</div>
              <button
                className="modal-contact-btn"
                onClick={() => {
                  window.location.href = "/Contact";
                }}
              >
                Contact Us About This Property
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sale_Home;
