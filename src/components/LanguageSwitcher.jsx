import { useTranslation } from "react-i18next";
import "../style/LanguageSwitcher.modules.css";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Store language preference in localStorage
    localStorage.setItem("language", lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={`lang-btn ${i18n.language === "tr" ? "active" : ""}`}
        onClick={() => changeLanguage("tr")}
      >
        TR
      </button>
      <button
        className={`lang-btn ${i18n.language === "ar" ? "active" : ""}`}
        onClick={() => changeLanguage("ar")}
      >
        AR
      </button>
    </div>
  );
}

export default LanguageSwitcher;
