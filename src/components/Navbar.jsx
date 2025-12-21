import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navbar.modules.css";
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
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
          <NavLink to={"/Home"}>Real State</NavLink>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to={"/Home"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/Contact"}>Contact</NavLink>
          </li>
          <li>
            <NavLink to={"/About"}>About</NavLink>
          </li>
          <li>
            <NavLink to={"/Home_Sale"}>Home Sale</NavLink>
          </li>
          <li>
            <NavLink to={"/Home_Rent"}>Home Rent</NavLink>
          </li>
          <li>
            <NavLink to={"/Car_Sale"}>Car Sale</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </li>
        </ul>
        <div className={`drop-list ${isDropdownOpen ? "active" : ""}`}>
          <ul className="drop-down-list">
            <li>
              <NavLink to={"/Home"} onClick={closeDropdown}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Contact"} onClick={closeDropdown}>
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to={"/About"} onClick={closeDropdown}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Home_Sale"} onClick={closeDropdown}>
                Home Sale
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Home_Rent"} onClick={closeDropdown}>
                Home Rent
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Car_Sale"} onClick={closeDropdown}>
                Car Sale
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard"} onClick={closeDropdown}>
                Dashboard
              </NavLink>
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
