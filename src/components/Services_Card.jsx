import { NavLink } from "react-router-dom";
import "../style/Services_Card.modules.css";

function Services_Card() {
  return (
    <>
      <div className="s-container">
        <div className="card">
          <NavLink to={"/Home_Sale"} className="title">
            Home Sale
          </NavLink>
        </div>
        <div className="card">
          <NavLink to={"/Home_Rent"} className="title">
            Home Rent
          </NavLink>
        </div>
        <div className="card">
          <NavLink to={"/Car_Sale"} className="title">
            Car Sale
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Services_Card;
