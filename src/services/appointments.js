/**
 * Appointments service
 * Manages appointments in localStorage
 */

const APPOINTMENTS_KEY = "real_state_appointments";

// Initialize appointments storage
function initializeAppointments() {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  if (!stored) {
    const defaultAppointments = [];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(defaultAppointments));
    return defaultAppointments;
  }
  try {
    return JSON.parse(stored);
  } catch {
    const defaultAppointments = [];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(defaultAppointments));
    return defaultAppointments;
  }
}

/**
 * Get all appointments
 * @returns {Array} - Array of all appointments
 */
export function getAllAppointments() {
  return initializeAppointments();
}

/**
 * Get next appointment ID
 * @returns {number} - Next available appointment ID
 */
function getNextAppointmentId() {
  const appointments = getAllAppointments();
  if (appointments.length === 0) return 1;
  return Math.max(...appointments.map((apt) => apt.id || 0)) + 1;
}

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data (customer info, date, time, property/car, etc.)
 * @returns {Object} - Created appointment with ID and timestamp
 */
export function createAppointment(appointmentData) {
  const appointments = getAllAppointments();
  const newAppointment = {
    id: getNextAppointmentId(),
    ...appointmentData,
    status: "pending", // pending, confirmed, completed, cancelled
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  console.log("Appointment created:", newAppointment);
  return newAppointment;
}

/**
 * Get appointment by ID
 * @param {number} appointmentId - Appointment ID
 * @returns {Object|null} - Appointment or null if not found
 */
export function getAppointmentById(appointmentId) {
  const appointments = getAllAppointments();
  return appointments.find((apt) => apt.id === appointmentId) || null;
}

/**
 * Update appointment status
 * @param {number} appointmentId - Appointment ID
 * @param {string} status - New status (pending, confirmed, completed, cancelled)
 * @returns {Object|null} - Updated appointment or null if not found
 */
export function updateAppointmentStatus(appointmentId, status) {
  const appointments = getAllAppointments();
  const index = appointments.findIndex((apt) => apt.id === appointmentId);

  if (index !== -1) {
    appointments[index].status = status;
    appointments[index].updatedAt = new Date().toISOString();
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    console.log(`Appointment ${appointmentId} status updated to ${status}`);
    return appointments[index];
  }

  return null;
}

/**
 * Delete an appointment
 * @param {number} appointmentId - Appointment ID
 * @returns {boolean} - True if deleted successfully
 */
export function deleteAppointment(appointmentId) {
  const appointments = getAllAppointments();
  const initialLength = appointments.length;
  const filteredAppointments = appointments.filter((apt) => apt.id !== appointmentId);

  if (filteredAppointments.length < initialLength) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filteredAppointments));
    console.log(`Appointment ${appointmentId} deleted`);
    return true;
  }

  return false;
}

/**
 * Get appointments by status
 * @param {string} status - Appointment status
 * @returns {Array} - Filtered appointments
 */
export function getAppointmentsByStatus(status) {
  const appointments = getAllAppointments();
  return appointments.filter((apt) => apt.status === status);
}

