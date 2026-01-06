import "../style/About.modules.css";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <>
      <div className="about-container">
        <div className="about-header">
          <h1>{t("about.title")}</h1>
          <p>{t("about.welcome")}</p>
        </div>

        <div className="about-content">
          <div className="about-card">
            <h2>{t("about.mission")}</h2>
            <p>{t("about.missionText")}</p>
          </div>

          <div className="about-card">
            <h2>{t("about.vision")}</h2>
            <p>{t("about.visionText")}</p>
          </div>

          <div className="about-card">
            <h2>{t("about.whyChooseUs")}</h2>
            <p>{t("about.whyChooseUsText")}</p>
          </div>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>{t("about.propertiesSold")}</p>
          </div>
          <div className="stat-item">
            <h3>1000+</h3>
            <p>{t("about.happyClients")}</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>{t("about.yearsExperience")}</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>{t("about.activeListings")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
