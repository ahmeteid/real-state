import { useState, useEffect } from "react";
import "../../style/Dashboard.modules.css";
import database from "../../services/database";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

function PropertyManager({ type, onUpdate }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadProperties();
  }, [type]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data =
        type === "sale"
          ? await database.getPropertiesForSale()
          : await database.getPropertiesForRent();
      setProperties(data);
    } catch (error) {
      console.error("Error loading properties:", error);
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
      const newProperty = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      };

      if (editingId) {
        // Update existing property
        await database.updateProperty(type, editingId, newProperty);
      } else {
        // Add new property
        await database.addProperty(type, newProperty);
      }

      resetForm();
      loadProperties();
      onUpdate();
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Error saving property. Please try again.");
    }
  };

  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area,
      price: property.price,
      description: property.description,
    });
    setEditingId(property.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await database.deleteProperty(type, id);
        loadProperties();
        onUpdate();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error deleting property. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      price: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Manage Properties for {type === "sale" ? "Sale" : "Rent"}</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Property
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>{editingId ? "Edit Property" : "Add New Property"}</h3>
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
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms *</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Area *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 2500 sqft"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={
                    type === "sale" ? "e.g., $450,000" : "e.g., $800/month"
                  }
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
                  {editingId ? "Update" : "Add"} Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="properties-list">
        {properties.length === 0 ? (
          <div className="empty-state">
            No properties found. Add your first property!
          </div>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="property-item">
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <div className="property-details">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>{property.area}</span>
                </div>
                <p className="property-price">{property.price}</p>
              </div>
              <div className="property-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(property)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(property.id)}
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

export default PropertyManager;
