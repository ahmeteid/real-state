import { useState } from "react";
import "../style/Contact.modules.css";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult(t("contact.sending"));
    setResultType("sending");
    const formData = new FormData(event.target);
    formData.append("access_key", "4e092e55-d705-403c-b9ed-64758e236f5c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(t("contact.success"));
        setResultType("success");
        event.target.reset();
      } else {
        setResult(t("contact.error"));
        setResultType("error");
      }
    } catch {
      setResult(t("contact.error"));
      setResultType("error");
    }
  };

  return (
    <>
      <div className="contact-container">
        <h1>{t("contact.title")}</h1>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t("contact.name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t("contact.namePlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t("contact.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("contact.emailPlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t("contact.phone")}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder={t("contact.phonePlaceholder")}
              required
              pattern="[0-9+\-\s()]+"
              title={t("contact.phoneValidationTitle")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{t("contact.message")}</label>
            <textarea
              id="message"
              name="message"
              placeholder={t("contact.messagePlaceholder")}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            {t("contact.submit")}
          </button>
          {result && (
            <div className={`result-message ${resultType}`}>{result}</div>
          )}
        </form>
      </div>
    </>
  );
}

export default Contact;
