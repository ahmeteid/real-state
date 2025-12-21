import { useState, useEffect } from "react";
import "../../style/Dashboard.modules.css";
import database from "../../services/database";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

function CarManager({ onUpdate }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await database.getCars();
      setCars(data);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCar = {
        ...formData,
        year: parseInt(formData.year),
      };

      if (editingId) {
        await database.updateCar(editingId, newCar);
      } else {
        await database.addCar(newCar);
      }

      resetForm();
      loadCars();
      onUpdate();
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Error saving car. Please try again.");
    }
  };

  const handleEdit = (car) => {
    setFormData({
      title: car.title,
      year: car.year.toString(),
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      price: car.price,
      description: car.description,
    });
    setEditingId(car.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await database.deleteCar(id);
        loadCars();
        onUpdate();
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Error deleting car. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      year: "",
      mileage: "",
      fuel: "",
      transmission: "",
      price: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Manage Cars</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Car
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>{editingId ? "Edit Car" : "Add New Car"}</h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="2000"
                    max="2030"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mileage *</label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g., 15,000 km"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fuel Type *</label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transmission *</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., $35,000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingId ? "Update" : "Add"} Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="properties-list">
        {cars.length === 0 ? (
          <div className="empty-state">No cars found. Add your first car!</div>
        ) : (
          cars.map((car) => (
            <div key={car.id} className="property-item">
              <div className="property-info">
                <h3>{car.title}</h3>
                <p className="property-location">Year: {car.year}</p>
                <div className="property-details">
                  <span>{car.mileage}</span>
                  <span>{car.fuel}</span>
                  <span>{car.transmission}</span>
                </div>
                <p className="property-price">{car.price}</p>
              </div>
              <div className="property-actions">
                <button className="edit-btn" onClick={() => handleEdit(car)}>
                  <FaEdit /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(car.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CarManager;
