import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.modules.css";
import database from "../services/database";
import PropertyManager from "../components/dashboard/PropertyManager";
import CarManager from "../components/dashboard/CarManager";
import {
  FaHome,
  FaCar,
  FaSignOutAlt,
  FaChartBar,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTimes,
  FaCheck,
  FaBars,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  logout,
  changePassword,
  getStoredCredentials,
  updateEmailAndPhone,
} from "../services/auth";
import LanguageSwitcher from "../components/LanguageSwitcher";

function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties-sale");
  const [stats, setStats] = useState({
    propertiesForSale: 0,
    propertiesForRent: 0,
    cars: 0,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    currentPassword: "",
    email: "",
    phone: "",
  });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [showContactPassword, setShowContactPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadStats();
    loadContactInfo();
  }, []);

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const loadContactInfo = () => {
    const credentials = getStoredCredentials();
    setContactInfo({
      email: credentials.email || "",
      phone: credentials.phone || "",
    });
    setContactForm({
      currentPassword: "",
      email: credentials.email || "",
      phone: credentials.phone || "",
    });
  };

  const handleEditContact = () => {
    setIsEditingContact(true);
    setContactForm({
      currentPassword: "",
      email: contactInfo.email,
      phone: contactInfo.phone,
    });
    setContactError("");
    setContactSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditingContact(false);
    setContactForm({
      currentPassword: "",
      email: contactInfo.email,
      phone: contactInfo.phone,
    });
    setContactError("");
    setContactSuccess("");
    setShowContactPassword(false);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
    setContactError("");
    setContactSuccess("");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactError("");
    setContactSuccess("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactForm.email && !emailRegex.test(contactForm.email)) {
      setContactError(t("dashboard.settings.invalidEmail"));
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (
      contactForm.phone &&
      !phoneRegex.test(contactForm.phone.replace(/\s/g, ""))
    ) {
      setContactError(t("dashboard.settings.invalidPhone"));
      return;
    }

    const success = updateEmailAndPhone(
      contactForm.currentPassword,
      contactForm.email.trim(),
      contactForm.phone.trim()
    );

    if (success) {
      setContactSuccess(t("dashboard.settings.contactInfoUpdated"));
      setContactInfo({
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
      });
      setIsEditingContact(false);
      setContactForm({
        currentPassword: "",
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
      });
      setShowContactPassword(false);
      setTimeout(() => setContactSuccess(""), 3000);
    } else {
      setContactError(t("dashboard.settings.incorrectCurrentPassword"));
    }
  };

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t("dashboard.settings.passwordMismatch"));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t("dashboard.settings.passwordTooShort"));
      return;
    }

    const success = changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (success) {
      setPasswordSuccess(t("dashboard.settings.passwordChanged"));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } else {
      setPasswordError(t("dashboard.settings.incorrectCurrentPassword"));
    }
  };

  return (
    <div className="dashboard-container">
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`dashboard-sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="dashboard-header">
          <div className="dashboard-header-top">
            <div>
              <h2>{t("dashboard.title")}</h2>
              <p>{t("dashboard.subtitle")}</p>
            </div>
          </div>
          <div className="dashboard-language-switcher">
            <LanguageSwitcher />
          </div>
        </div>

        <button
          className="sidebar-close-btn"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
        <nav className="dashboard-nav">
          <button
            className={`nav-item ${
              activeTab === "properties-sale" ? "active" : ""
            }`}
            onClick={() => handleNavClick("properties-sale")}
          >
            <FaHome /> {t("dashboard.propertiesForSale")}
          </button>
          <button
            className={`nav-item ${
              activeTab === "properties-rent" ? "active" : ""
            }`}
            onClick={() => handleNavClick("properties-rent")}
          >
            <FaHome /> {t("dashboard.propertiesForRent")}
          </button>
          <button
            className={`nav-item ${activeTab === "cars" ? "active" : ""}`}
            onClick={() => handleNavClick("cars")}
          >
            <FaCar /> {t("dashboard.cars")}
          </button>
          <button
            className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => handleNavClick("stats")}
          >
            <FaChartBar /> {t("dashboard.statistics")}
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => handleNavClick("settings")}
          >
            <FaCog /> {t("dashboard.settings.title")}
          </button>
        </nav>

        <div className="dashboard-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> {t("dashboard.logout")}
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
          {activeTab === "settings" && (
            <div className="settings-container">
              <h2>{t("dashboard.settings.title")}</h2>

              <div className="settings-section">
                <h3>{t("dashboard.settings.changePassword")}</h3>
                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  {passwordError && (
                    <div className="settings-error">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="settings-success">{passwordSuccess}</div>
                  )}

                  <div className="form-group">
                    <label>{t("dashboard.settings.currentPassword")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder={t(
                          "dashboard.settings.currentPasswordPlaceholder"
                        )}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t("dashboard.settings.newPassword")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder={t(
                          "dashboard.settings.newPasswordPlaceholder"
                        )}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t("dashboard.settings.confirmPassword")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder={t(
                          "dashboard.settings.confirmPasswordPlaceholder"
                        )}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="settings-btn">
                    {t("dashboard.settings.updatePassword")}
                  </button>
                </form>
              </div>

              <div className="settings-section">
                <div className="settings-section-header">
                  <h3>{t("dashboard.settings.contactInfo")}</h3>
                  {!isEditingContact && (
                    <button
                      type="button"
                      className="edit-contact-btn"
                      onClick={handleEditContact}
                    >
                      <FaEdit /> {t("dashboard.settings.editContactInfo")}
                    </button>
                  )}
                </div>

                {!isEditingContact ? (
                  <div className="contact-info-display">
                    <div className="contact-info-item">
                      <label>{t("dashboard.settings.email")}</label>
                      <div className="contact-info-value">
                        {contactInfo.email || t("dashboard.settings.notSet")}
                      </div>
                    </div>
                    <div className="contact-info-item">
                      <label>{t("dashboard.settings.phone")}</label>
                      <div className="contact-info-value">
                        {contactInfo.phone || t("dashboard.settings.notSet")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    className="settings-form"
                  >
                    {contactError && (
                      <div className="settings-error">{contactError}</div>
                    )}
                    {contactSuccess && (
                      <div className="settings-success">{contactSuccess}</div>
                    )}

                    <div className="form-group">
                      <label>{t("dashboard.settings.currentPassword")}</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showContactPassword ? "text" : "password"}
                          name="currentPassword"
                          value={contactForm.currentPassword}
                          onChange={handleContactChange}
                          placeholder={t(
                            "dashboard.settings.currentPasswordPlaceholder"
                          )}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() =>
                            setShowContactPassword(!showContactPassword)
                          }
                          tabIndex={-1}
                        >
                          {showContactPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{t("dashboard.settings.email")}</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder={t("dashboard.settings.emailPlaceholder")}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{t("dashboard.settings.phone")}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        placeholder={t("dashboard.settings.phonePlaceholder")}
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes /> {t("dashboard.settings.cancel")}
                      </button>
                      <button type="submit" className="save-btn">
                        <FaCheck /> {t("dashboard.settings.updateContactInfo")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
