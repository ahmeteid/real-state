import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login, isAuthenticated, resetPassword, emailExists } from "../services/auth";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { FaTimes, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../style/Login.modules.css";

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetting, setResetting] = useState(false);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = login(formData.username, formData.password);

      if (success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(t("login.invalidCredentials"));
      }
    } catch (err) {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetChange = (e) => {
    setResetForm({
      ...resetForm,
      [e.target.name]: e.target.value,
    });
    setResetError("");
    setResetSuccess("");
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetForm.email)) {
      setResetError(t("login.invalidEmail"));
      return;
    }

    // Check if email exists in credentials
    if (!emailExists(resetForm.email)) {
      setResetError(t("login.emailNotRegistered"));
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError(t("login.resetPasswordMismatch"));
      return;
    }

    if (resetForm.newPassword.length < 6) {
      setResetError(t("login.passwordTooShort"));
      return;
    }

    setResetting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = resetPassword(resetForm.email, resetForm.newPassword);

      if (success) {
        setResetSuccess(t("login.passwordResetSuccess"));
        setResetForm({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowResetPassword(false);
        setShowResetConfirmPassword(false);
        // Auto close modal after 2 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
        }, 2000);
      } else {
        setResetError(t("login.emailNotRegistered"));
      }
    } catch (err) {
      setResetError(t("login.error"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-language-switcher">
        <LanguageSwitcher />
      </div>
      <div className="login-card">
        <button
          type="button"
          className="back-to-home-btn"
          onClick={() => navigate("/")}
          aria-label={t("login.backToHome")}
        >
          <FaArrowLeft /> {t("login.backToHome")}
        </button>
        <div className="login-header">
          <h1>{t("login.title")}</h1>
          <p>{t("login.subtitle")}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="username">{t("login.username")}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t("login.usernamePlaceholder")}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("login.password")}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("login.passwordPlaceholder")}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? t("login.loggingIn") : t("login.loginButton")}
          </button>

          <div className="forgot-password-link">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="forgot-password-btn"
            >
              {t("login.forgotPassword")}
            </button>
          </div>
        </form>

        {showForgotPassword && (
          <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
            <div className="reset-password-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t("login.resetPassword")}</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetForm({
                      email: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setResetError("");
                    setResetSuccess("");
                    setShowResetPassword(false);
                    setShowResetConfirmPassword(false);
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <form className="reset-password-form" onSubmit={handleResetSubmit}>
                {resetError && (
                  <div className="login-error">{resetError}</div>
                )}
                {resetSuccess && (
                  <div className="login-success">{resetSuccess}</div>
                )}

                <div className="form-group">
                  <label htmlFor="reset-email">{t("login.email")}</label>
                  <input
                    type="email"
                    id="reset-email"
                    name="email"
                    value={resetForm.email}
                    onChange={handleResetChange}
                    placeholder={t("login.emailPlaceholder")}
                    required
                    disabled={resetting}
                  />
                  <small className="form-hint">{t("login.emailHint")}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="reset-new-password">{t("login.newPassword")}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      id="reset-new-password"
                      name="newPassword"
                      value={resetForm.newPassword}
                      onChange={handleResetChange}
                      placeholder={t("login.newPasswordPlaceholder")}
                      required
                      minLength={6}
                      disabled={resetting}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      tabIndex={-1}
                    >
                      {showResetPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reset-confirm-password">{t("login.confirmPassword")}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showResetConfirmPassword ? "text" : "password"}
                      id="reset-confirm-password"
                      name="confirmPassword"
                      value={resetForm.confirmPassword}
                      onChange={handleResetChange}
                      placeholder={t("login.confirmPasswordPlaceholder")}
                      required
                      minLength={6}
                      disabled={resetting}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showResetConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="login-btn" 
                  disabled={resetting}
                >
                  {resetting ? t("login.resetting") : t("login.resetPasswordButton")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
