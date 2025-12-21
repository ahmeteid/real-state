import { NavLink } from "react-router-dom";
import "../style/Footer.modules.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Real State</h3>
            <p>
              Your trusted partner in finding the perfect property. We connect
              buyers, renters, and sellers with their dream homes and vehicles.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/Home">Home</NavLink>
              </li>
              <li>
                <NavLink to="/About">About</NavLink>
              </li>
              <li>
                <NavLink to="/Contact">Contact</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>
                <NavLink to="/Home_Sale">Home Sale</NavLink>
              </li>
              <li>
                <NavLink to="/Home_Rent">Home Rent</NavLink>
              </li>
              <li>
                <NavLink to="/Car_Sale">Car Sale</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul>
              <li>📧 info@realstate.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Main Street, City, Country</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Real State. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;

