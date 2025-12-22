import { NavLink } from "react-router-dom";
import "../style/Services_Card.modules.css";
import { useTranslation } from "react-i18next";

function Services_Card() {
  const { t } = useTranslation();

  return (
    <>
      <div className="s-container">
        <div className="card">
          <NavLink to={"/Home_Sale"} className="title">
            {t("services.homeSale")}
          </NavLink>
        </div>
        <div className="card">
          <NavLink to={"/Home_Rent"} className="title">
            {t("services.homeRent")}
          </NavLink>
        </div>
        <div className="card">
          <NavLink to={"/Car_Sale"} className="title">
            {t("services.carSale")}
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Services_Card;
