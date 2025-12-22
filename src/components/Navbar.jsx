import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navbar.modules.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="Nav_Bar">
        <div className="logo">
          <NavLink to={"/Home"}>{t("navbar.logo")}</NavLink>
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
            <NavLink to={"/dashboard"}>{t("navbar.dashboard")}</NavLink>
          </li>
        </ul>
        <div className="navbar-actions">
          <LanguageSwitcher />
        </div>
        <div className={`drop-list ${isDropdownOpen ? "active" : ""}`}>
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
              <NavLink to={"/dashboard"} onClick={closeDropdown}>
                {t("navbar.dashboard")}
              </NavLink>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
        <div className="menu-bar" onClick={toggleDropdown}>
          <span>
            <GiHamburgerMenu />
          </span>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
