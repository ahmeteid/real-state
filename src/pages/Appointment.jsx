import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { createAppointment } from "../services/appointments";
import database from "../services/database";
import "../style/Contact.modules.css";

function Appointment() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentType: "property-sale", // property-sale, property-rent, car
    itemId: "",
    date: "",
    time: "",
    message: "",
  });
  const [propertiesForSale, setPropertiesForSale] = useState([]);
  const [propertiesForRent, setPropertiesForRent] = useState([]);
  const [cars, setCars] = useState([]);
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const [sale, rent, carList] = await Promise.all([
        database.getPropertiesForSale(),
        database.getPropertiesForRent(),
        database.getCars(),
      ]);
      setPropertiesForSale(sale);
      setPropertiesForRent(rent);
      setCars(carList);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Reset itemId when appointment type changes
      ...(name === "appointmentType" && { itemId: "" }),
    });
  };

  const getAvailableItems = () => {
    switch (formData.appointmentType) {
      case "property-sale":
        return propertiesForSale;
      case "property-rent":
        return propertiesForRent;
      case "car":
        return cars;
      default:
        return [];
    }
  };

  const getItemTitle = (item) => {
    if (!item) return "";
    const lang = i18n.language;
    // Check for localized title
    if (item.title && typeof item.title === "object" && item.title[lang]) {
      return item.title[lang];
    }
    const localizedField = `title_${lang}`;
    if (item[localizedField]) {
      return item[localizedField];
    }
    return item.title || item.title_en || "N/A";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(t("appointment.submitting"));
    setResultType("sending");

    try {
      const selectedItem = getAvailableItems().find(
        (item) => item.id === parseInt(formData.itemId)
      );

      const appointment = createAppointment({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        appointmentType: formData.appointmentType,
        itemId: parseInt(formData.itemId),
        item: selectedItem,
        date: formData.date,
        time: formData.time,
        message: formData.message,
      });

      // Send email via Web3Forms (same as contact form) to ensure same email destination
      const appointmentFormData = new FormData();
      appointmentFormData.append("access_key", "4e092e55-d705-403c-b9ed-64758e236f5c");
      appointmentFormData.append("subject", `New Appointment Request #${appointment.id}`);
      appointmentFormData.append("name", formData.name);
      appointmentFormData.append("email", formData.email);
      appointmentFormData.append("phone", formData.phone);
      
      const appointmentType =
        formData.appointmentType === "property-sale"
          ? "Property for Sale"
          : formData.appointmentType === "property-rent"
          ? "Property for Rent"
          : "Car";

      const itemTitle = getItemTitle(selectedItem);

      const appointmentDetails = `Appointment Details:
- Type: ${appointmentType}
- Item: ${itemTitle}
- Date: ${new Date(formData.date).toLocaleDateString()}
- Time: ${formData.time}
- Appointment ID: #${appointment.id}
${formData.message ? `\nMessage:\n${formData.message}` : ""}`;

      appointmentFormData.append("message", appointmentDetails);

      try {
        const emailResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: appointmentFormData,
        });

        const emailData = await emailResponse.json();
        if (!emailData.success) {
          console.warn("Email notification failed, but appointment was saved");
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the appointment creation if email fails
      }

      setResult(
        `${t("appointment.successMessage")} ${t("appointment.appointmentId")}: #${appointment.id}`
      );
      setResultType("success");
      e.target.reset();
      
      // Reset form data
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointmentType: "property-sale",
        itemId: "",
        date: "",
        time: "",
        message: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      setResult(t("appointment.error"));
      setResultType("error");
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const availableItems = getAvailableItems();

  return (
    <>
      <div className="contact-container">
        <h1>
          <FaCalendarAlt style={{ marginRight: "10px", display: "inline-block", verticalAlign: "middle" }} />
          {t("appointment.title")}
        </h1>
        <p className="subtitle">{t("appointment.subtitle")}</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t("appointment.name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("appointment.namePlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t("appointment.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("appointment.emailPlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t("appointment.phone")}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("appointment.phonePlaceholder")}
              required
              pattern="[0-9+\-\s()]+"
              title={t("contact.phoneValidationTitle")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="appointmentType">{t("appointment.appointmentType")}</label>
            <select
              id="appointmentType"
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              required
            >
              <option value="property-sale">
                {t("appointment.propertySale")}
              </option>
              <option value="property-rent">
                {t("appointment.propertyRent")}
              </option>
              <option value="car">{t("appointment.car")}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="itemId">{t("appointment.selectItem")}</label>
            <select
              id="itemId"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              required
            >
              <option value="">
                {t("appointment.selectItemPlaceholder")}
              </option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {getItemTitle(item)} - {item.price || item.price_en || "N/A"}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">
              <FaCalendarAlt /> {t("appointment.date")}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={getMinDate()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">
              <FaClock /> {t("appointment.time")}
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{t("appointment.message")}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("appointment.messagePlaceholder")}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            {t("appointment.submit")}
          </button>
          {result && (
            <div className={`result-message ${resultType}`}>
              {resultType === "success" && <FaCheckCircle style={{ fontSize: "1.2rem" }} />}
              {resultType === "sending" && (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid white",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              <span>{result}</span>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Appointment;

