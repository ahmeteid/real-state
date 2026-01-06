import Services_Card from "../components/Services_Card";
import "../style/Home.modules.css";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <div className="home-container">
        <div className="hero-section">
          <h1>{t("home.title")}</h1>
          <p>{t("home.description")}</p>
        </div>
        <Services_Card />
      </div>
    </>
  );
}

export default Home;
