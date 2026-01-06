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
import ImageCarousel from "../components/ImageCarousel";
import { useTranslation } from "react-i18next";
import { getLocalizedContent } from "../utils/localizeContent";

function Sale_Home() {
  const { t, i18n } = useTranslation();
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
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="properties-container">
        <div className="page-header">
          <h1>{t("propertySale.pageTitle")}</h1>
          <p>{t("propertySale.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties-container">
        <div className="page-header">
          <h1>{t("propertySale.pageTitle")}</h1>
          <p style={{ color: "red" }}>{t("propertySale.error")}: {error}</p>
          <p>{t("propertySale.errorMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="properties-container">
        <div className="page-header">
          <h1>{t("propertySale.pageTitle")}</h1>
          <p>{t("propertySale.pageDescription")}</p>
        </div>

        <div className="properties-grid">
          {properties.map((property) => {
            const lang = i18n.language;
            const title = getLocalizedContent(property, 'title', lang);
            const location = getLocalizedContent(property, 'location', lang);
            const area = getLocalizedContent(property, 'area', lang);
            const description = getLocalizedContent(property, 'description', lang);
            const price = getLocalizedContent(property, 'price', lang);
            
            return (
              <div
                key={property.id}
                className="property-card"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="property-image">
                  <ImageCarousel
                    images={
                      property.images || (property.image ? [property.image] : [])
                    }
                    fallbackEmoji="🏠"
                    alt={title}
                  />
                </div>
                <div className="property-details">
                  <h2 className="property-title">{title}</h2>
                  <div className="property-location">
                    <FaMapMarkerAlt />
                    <span>{location}</span>
                  </div>
                  <div className="property-info">
                    <span>
                      <FaBed /> {property.bedrooms}
                    </span>
                    <span>
                      <FaBath /> {property.bathrooms}
                    </span>
                    <span>
                      <FaRulerCombined /> {area}
                    </span>
                  </div>
                  <p className="property-description">{description}</p>
                  <div className="property-price">{price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProperty && (() => {
        const lang = i18n.language;
        const title = getLocalizedContent(selectedProperty, 'title', lang);
        const location = getLocalizedContent(selectedProperty, 'location', lang);
        const area = getLocalizedContent(selectedProperty, 'area', lang);
        const description = getLocalizedContent(selectedProperty, 'description', lang);
        const price = getLocalizedContent(selectedProperty, 'price', lang);
        
        return (
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
              <div className="modal-image">
                <ImageCarousel
                  images={
                    selectedProperty.images ||
                    (selectedProperty.image ? [selectedProperty.image] : [])
                  }
                  fallbackEmoji="🏠"
                  alt={title}
                />
              </div>
              <div className="modal-body">
                <h2 className="modal-title">{title}</h2>
                <div className="modal-section">
                  <div className="modal-info-grid">
                    <div className="modal-info-item">
                      <FaMapMarkerAlt />
                      <span>{location}</span>
                    </div>
                    <div className="modal-info-item">
                      <FaBed />
                      <span>{selectedProperty.bedrooms} {t("propertySale.bedrooms")}</span>
                    </div>
                    <div className="modal-info-item">
                      <FaBath />
                      <span>{selectedProperty.bathrooms} {t("propertySale.bathrooms")}</span>
                    </div>
                    <div className="modal-info-item">
                      <FaRulerCombined />
                      <span>{area}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-section">
                  <h3>{t("propertySale.description")}</h3>
                  <p>{description}</p>
                  <p>
                    {t("propertySale.defaultDescription")}
                  </p>
                </div>
                <div className="modal-section">
                  <h3>{t("propertySale.features")}</h3>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "2",
                      paddingLeft: "20px",
                    }}
                  >
                    <li>{t("propertySale.feature1")}</li>
                    <li>{t("propertySale.feature2")}</li>
                    <li>{t("propertySale.feature3")}</li>
                    <li>{t("propertySale.feature4")}</li>
                    <li>{t("propertySale.feature5")}</li>
                    <li>{t("propertySale.feature6")}</li>
                  </ul>
                </div>
                <div className="modal-price">{price}</div>
                <button
                  className="modal-contact-btn"
                  onClick={() => {
                    window.location.href = "/Contact";
                  }}
                >
                  {t("propertySale.contactButton")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default Sale_Home;
