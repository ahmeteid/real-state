import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import "../style/LanguageSwitcher.modules.css";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = ["en", "tr", "ar"];
  const languageLabels = {
    en: "EN",
    tr: "TR",
    ar: "AR"
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="lang-btn active"
        onClick={() => setIsOpen(!isOpen)}
        title="Select language"
      >
        {languageLabels[i18n.language]}
        <FaChevronDown className={`lang-arrow ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <div className="lang-dropdown">
          {languages.map((lng) => (
            <button
              key={lng}
              className={`lang-option ${i18n.language === lng ? "active" : ""}`}
              onClick={() => changeLanguage(lng)}
            >
              {languageLabels[lng]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
