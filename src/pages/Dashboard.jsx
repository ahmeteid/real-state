import { useState, useEffect } from "react";
import "../style/Dashboard.modules.css";
import database from "../services/database";
import PropertyManager from "../components/dashboard/PropertyManager";
import CarManager from "../components/dashboard/CarManager";
import { FaHome, FaCar, FaSignOutAlt, FaChartBar } from "react-icons/fa";

function Dashboard() {
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
          <h2>Admin Dashboard</h2>
          <p>Real State Management</p>
        </div>

        <nav className="dashboard-nav">
          <button
            className={`nav-item ${
              activeTab === "properties-sale" ? "active" : ""
            }`}
            onClick={() => setActiveTab("properties-sale")}
          >
            <FaHome /> Properties for Sale
          </button>
          <button
            className={`nav-item ${
              activeTab === "properties-rent" ? "active" : ""
            }`}
            onClick={() => setActiveTab("properties-rent")}
          >
            <FaHome /> Properties for Rent
          </button>
          <button
            className={`nav-item ${activeTab === "cars" ? "active" : ""}`}
            onClick={() => setActiveTab("cars")}
          >
            <FaCar /> Cars
          </button>
          <button
            className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <FaChartBar /> Statistics
          </button>
        </nav>

        <div className="dashboard-footer">
          <button
            className="logout-btn"
            onClick={() => (window.location.href = "/")}
          >
            <FaSignOutAlt /> Back to Site
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
              <h2>Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.propertiesForSale}</h3>
                  <p>Properties for Sale</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.propertiesForRent}</h3>
                  <p>Properties for Rent</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.cars}</h3>
                  <p>Cars Available</p>
                </div>
                <div className="stat-card">
                  <h3>
                    {stats.propertiesForSale +
                      stats.propertiesForRent +
                      stats.cars}
                  </h3>
                  <p>Total Listings</p>
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
