import { useState } from "react";
import "../style/Contact.modules.css";

function Contact() {
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
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
        setResult("Form Submitted Successfully!");
        setResultType("success");
        event.target.reset();
      } else {
        setResult("Error submitting form. Please try again.");
        setResultType("error");
      }
    } catch {
      setResult("Error submitting form. Please try again.");
      setResultType("error");
    }
  };

  return (
    <>
      <div className="contact-container">
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
              pattern="[0-9+\-\s()]+"
              title="Please enter a valid phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Submit Form
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
