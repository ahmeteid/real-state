/**
 * Email service
 * Handles sending email notifications for appointments
 */

import { getCredentials } from "./auth";

/**
 * Get admin email from credentials
 * Priority: Dashboard email > Default email
 * @returns {string} - Admin email (dashboard email if set, otherwise default)
 */
export function getAdminEmail() {
  const credentials = getCredentials();
  // Use dashboard email if it's set and not empty, otherwise use default email
  if (credentials.email && credentials.email.trim() !== "") {
    return credentials.email.trim();
  }
  return "asfrontdev@gmail.com";
}

/**
 * Send appointment notification email
 * @param {Object} appointmentData - Appointment data
 * @returns {boolean} - True if email would be sent (simulated)
 */
export function sendAppointmentEmail(appointmentData) {
  // Get email from dashboard settings (or default if not set)
  const recipientEmail = getAdminEmail();

  if (!recipientEmail) {
    console.warn("No recipient email available");
    return false;
  }

  // Format appointment data for email
  const subject = encodeURIComponent(
    `New Appointment Request #${appointmentData.id}`
  );

  const appointmentType =
    appointmentData.appointmentType === "property-sale"
      ? "Property for Sale"
      : appointmentData.appointmentType === "property-rent"
      ? "Property for Rent"
      : "Car";

  const itemTitle =
    appointmentData.item?.title ||
    (appointmentData.item?.title_en ? appointmentData.item.title_en : "N/A");

  const body = encodeURIComponent(`New Appointment Request

Appointment ID: #${appointmentData.id}

Customer Information:
- Name: ${appointmentData.customer.name}
- Email: ${appointmentData.customer.email}
- Phone: ${appointmentData.customer.phone}

Appointment Details:
- Type: ${appointmentType}
- Item: ${itemTitle}
- Date: ${new Date(appointmentData.date).toLocaleDateString()}
- Time: ${appointmentData.time}

${appointmentData.message ? `Message:\n${appointmentData.message}\n` : ""}

---
This is an automated notification from Real State Appointment System.`);

  // Create mailto link
  const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

  // Open email client
  try {
    window.location.href = mailtoLink;
    console.log("Email notification opened in default email client");
    return true;
  } catch (error) {
    console.error("Error opening email client:", error);
    return false;
  }
}

/**
 * Send appointment notification using EmailJS (if configured)
 * This requires EmailJS service setup
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<boolean>} - True if email sent successfully
 */
export async function sendAppointmentEmailJS(appointmentData) {
  // This is a placeholder for EmailJS integration
  // To use this, install: npm install @emailjs/browser
  // Then configure EmailJS service ID, template ID, and public key

  // Uncomment and configure when EmailJS is set up
  /*
  try {
    const { default: emailjs } = await import('@emailjs/browser');
    
    const adminEmail = getAdminEmail();
    if (!adminEmail) {
      console.warn("No admin email configured");
      return false;
    }

    const templateParams = {
      to_email: adminEmail,
      appointment_id: appointmentData.id,
      customer_name: appointmentData.customer.name,
      customer_email: appointmentData.customer.email,
      customer_phone: appointmentData.customer.phone,
      appointment_type: appointmentData.appointmentType,
      item_title: appointmentData.item?.title || "N/A",
      appointment_date: appointmentData.date,
      appointment_time: appointmentData.time,
      message: appointmentData.message || "No additional message",
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error sending email via EmailJS:", error);
    return false;
  }
  */

  // Placeholder - EmailJS not configured
  console.log("EmailJS not configured, appointment data:", appointmentData);
  return false;
}
