import { useState, useEffect } from "react";
import "../style/Dashboard.modules.css";
import database from "../services/database";
import PropertyManager from "../components/dashboard/PropertyManager";
import CarManager from "../components/dashboard/CarManager";
import { FaHome, FaCar, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("properties-sale");
  const [stats, setStats] = useState({
    propertiesForSale: 0,
    propertiesForRent: 0,
    cars: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [sale, rent, cars] = await Promise.all([
        database.getPropertiesForSale(),
        database.getPropertiesForRent(),
        database.getCars(),
      ]);
      setStats({
        propertiesForSale: sale.length,
        propertiesForRent: rent.length,
        cars: cars.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleDataUpdate = () => {
    loadStats();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="dashboard-header">
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        <nav className="dashboard-nav">
          <button
            className={`nav-item ${
              activeTab === "properties-sale" ? "active" : ""
            }`}
            onClick={() => setActiveTab("properties-sale")}
          >
            <FaHome /> {t("dashboard.propertiesForSale")}
          </button>
          <button
            className={`nav-item ${
              activeTab === "properties-rent" ? "active" : ""
            }`}
            onClick={() => setActiveTab("properties-rent")}
          >
            <FaHome /> {t("dashboard.propertiesForRent")}
          </button>
          <button
            className={`nav-item ${activeTab === "cars" ? "active" : ""}`}
            onClick={() => setActiveTab("cars")}
          >
            <FaCar /> {t("dashboard.cars")}
          </button>
          <button
            className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <FaChartBar /> {t("dashboard.statistics")}
          </button>
        </nav>

        <div className="dashboard-footer">
          <button
            className="logout-btn"
            onClick={() => (window.location.href = "/")}
          >
            <FaSignOutAlt /> {t("dashboard.backToSite")}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          {activeTab === "properties-sale" && (
            <PropertyManager type="sale" onUpdate={handleDataUpdate} />
          )}
          {activeTab === "properties-rent" && (
            <PropertyManager type="rent" onUpdate={handleDataUpdate} />
          )}
          {activeTab === "cars" && <CarManager onUpdate={handleDataUpdate} />}
          {activeTab === "stats" && (
            <div className="stats-container">
              <h2>{t("dashboard.statistics")}</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.propertiesForSale}</h3>
                  <p>{t("dashboard.stats.propertiesForSale")}</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.propertiesForRent}</h3>
                  <p>{t("dashboard.stats.propertiesForRent")}</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.cars}</h3>
                  <p>{t("dashboard.stats.carsAvailable")}</p>
                </div>
                <div className="stat-card">
                  <h3>
                    {stats.propertiesForSale +
                      stats.propertiesForRent +
                      stats.cars}
                  </h3>
                  <p>{t("dashboard.stats.totalListings")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
