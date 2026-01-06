import { NavLink } from "react-router-dom";
import "../style/Footer.modules.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>{t("footer.title")}</h3>
            <p>{t("footer.description")}</p>
          </div>

          <div className="footer-section">
            <h4>{t("footer.quickLinks")}</h4>
            <ul>
              <li>
                <NavLink to="/Home">{t("navbar.home")}</NavLink>
              </li>
              <li>
                <NavLink to="/About">{t("navbar.about")}</NavLink>
              </li>
              <li>
                <NavLink to="/Contact">{t("navbar.contact")}</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t("footer.services")}</h4>
            <ul>
              <li>
                <NavLink to="/Home_Sale">{t("navbar.homeSale")}</NavLink>
              </li>
              <li>
                <NavLink to="/Home_Rent">{t("navbar.homeRent")}</NavLink>
              </li>
              <li>
                <NavLink to="/Car_Sale">{t("navbar.carSale")}</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t("footer.contactInfo")}</h4>
            <ul>
              <li>📧 info@realstate.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Main Street, City, Country</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
