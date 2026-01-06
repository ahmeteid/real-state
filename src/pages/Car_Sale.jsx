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
import { useTranslation } from "react-i18next";
import { getLocalizedContent } from "../utils/localizeContent";

function Car_Sale() {
  const { t, i18n } = useTranslation();
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
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="cars-container">
        <div className="page-header">
          <h1>{t("carSale.pageTitle")}</h1>
          <p>{t("carSale.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-container">
        <div className="page-header">
          <h1>{t("carSale.pageTitle")}</h1>
          <p style={{ color: "red" }}>{t("carSale.error")}: {error}</p>
          <p>{t("carSale.errorMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cars-container">
        <div className="page-header">
          <h1>{t("carSale.pageTitle")}</h1>
          <p>{t("carSale.pageDescription")}</p>
        </div>

        <div className="cars-grid">
          {cars.map((car) => {
            const lang = i18n.language;
            const title = getLocalizedContent(car, 'title', lang);
            const description = getLocalizedContent(car, 'description', lang);
            const price = getLocalizedContent(car, 'price', lang);
            const mileage = getLocalizedContent(car, 'mileage', lang) || car.mileage;
            
            return (
              <div
                key={car.id}
                className="car-card"
                onClick={() => setSelectedCar(car)}
              >
                <div className="car-image">
                  <ImageCarousel
                    images={car.images || (car.image ? [car.image] : [])}
                    fallbackEmoji="🚗"
                    alt={title}
                  />
                </div>
                <div className="car-details">
                  <h2 className="car-title">{title}</h2>
                  <div className="car-year">{t("carSale.year")}: {car.year}</div>
                  <div className="car-specs">
                    <span>
                      <FaTachometerAlt /> {mileage}
                    </span>
                    <span>
                      <FaGasPump /> {car.fuel}
                    </span>
                    <span>
                      <FaCog /> {car.transmission}
                    </span>
                  </div>
                  <p className="car-description">{description}</p>
                  <div className="car-price">{price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCar && (() => {
        const lang = i18n.language;
        const title = getLocalizedContent(selectedCar, 'title', lang);
        const description = getLocalizedContent(selectedCar, 'description', lang);
        const price = getLocalizedContent(selectedCar, 'price', lang);
        const mileage = getLocalizedContent(selectedCar, 'mileage', lang) || selectedCar.mileage;
        
        return (
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
                  alt={title}
                />
              </div>
              <div className="modal-body">
                <h2 className="modal-title">{title}</h2>
                <div className="modal-section">
                  <div className="modal-info-grid">
                    <div className="modal-info-item">
                      <FaCalendarAlt />
                      <span>{t("carSale.year")}: {selectedCar.year}</span>
                    </div>
                    <div className="modal-info-item">
                      <FaTachometerAlt />
                      <span>{mileage}</span>
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
                  <h3>{t("carSale.description")}</h3>
                  <p>{description}</p>
                  <p>
                    {t("carSale.defaultDescription")}
                  </p>
                </div>
                <div className="modal-section">
                  <h3>{t("carSale.features")}</h3>
                  <ul
                    style={{
                      color: "#555",
                      lineHeight: "2",
                      paddingLeft: "20px",
                    }}
                  >
                    <li>{t("carSale.feature1")}</li>
                    <li>{t("carSale.feature2")}</li>
                    <li>{t("carSale.feature3")}</li>
                    <li>{t("carSale.feature4")}</li>
                    <li>{t("carSale.feature5")}</li>
                    <li>{t("carSale.feature6")}</li>
                  </ul>
                </div>
                <div className="modal-price">{price}</div>
                <button
                  className="modal-contact-btn"
                  onClick={() => {
                    window.location.href = "/Contact";
                  }}
                >
                  {t("carSale.contactButton")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default Car_Sale;
