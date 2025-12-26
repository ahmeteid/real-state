import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navbar.modules.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuBarRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isDropdownOpen]);

  return (
    <>
      {/* Overlay for mobile menu */}
      {isDropdownOpen && (
        <div className="navbar-overlay" onClick={closeDropdown}></div>
      )}

      <nav className="Nav_Bar">
        <div className="logo">
          <NavLink to={"/Home"} onClick={closeDropdown}>
            {t("navbar.logo")}
          </NavLink>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to={"/Home"}>{t("navbar.home")}</NavLink>
          </li>
          <li>
            <NavLink to={"/Contact"}>{t("navbar.contact")}</NavLink>
          </li>
          <li>
            <NavLink to={"/About"}>{t("navbar.about")}</NavLink>
          </li>
          <li>
            <NavLink to={"/Home_Sale"}>{t("navbar.homeSale")}</NavLink>
          </li>
          <li>
            <NavLink to={"/Home_Rent"}>{t("navbar.homeRent")}</NavLink>
          </li>
          <li>
            <NavLink to={"/Car_Sale"}>{t("navbar.carSale")}</NavLink>
          </li>
          <li>
            <NavLink to={"/Appointment"}>{t("navbar.appointment")}</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard"}>{t("navbar.dashboard")}</NavLink>
          </li>
        </ul>
        <div className="navbar-actions">
          <LanguageSwitcher />
        </div>
        <div
          ref={dropdownRef}
          className={`drop-list ${isDropdownOpen ? "active" : ""}`}
        >
          <ul className="drop-down-list">
            <li>
              <NavLink to={"/Home"} onClick={closeDropdown}>
                {t("navbar.home")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Contact"} onClick={closeDropdown}>
                {t("navbar.contact")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/About"} onClick={closeDropdown}>
                {t("navbar.about")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Home_Sale"} onClick={closeDropdown}>
                {t("navbar.homeSale")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Home_Rent"} onClick={closeDropdown}>
                {t("navbar.homeRent")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Car_Sale"} onClick={closeDropdown}>
                {t("navbar.carSale")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Appointment"} onClick={closeDropdown}>
                {t("navbar.appointment")}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard"} onClick={closeDropdown}>
                {t("navbar.dashboard")}
              </NavLink>
            </li>
            <li className="language-switcher-item">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
        <div
          ref={menuBarRef}
          className="menu-bar"
          onClick={toggleDropdown}
          aria-label="Toggle menu"
        >
          <span className={isDropdownOpen ? "menu-open" : ""}>
            {isDropdownOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </span>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
