import { useState, useEffect } from "react";
import "../../style/Dashboard.modules.css";
import database from "../../services/database";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function PropertyManager({ type, onUpdate }) {
  const { t } = useTranslation();
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
    images: [],
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(t("dashboard.propertyManager.invalidImageType"));
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(t("dashboard.propertyManager.imageTooLarge"));
          return false;
        }
        return true;
      });

      const readers = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setFormData({
          ...formData,
          images: [...formData.images, ...results],
        });
      });
    }
    // Reset file input to allow selecting the same file again
    e.target.value = "";
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
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
        // Update existing property - all changes saved to database (localStorage)
        await database.updateProperty(type, editingId, newProperty);
      } else {
        // Add new property - saved to database (localStorage)
        await database.addProperty(type, newProperty);
      }

      resetForm();
      loadProperties(); // Reload to reflect changes
      onUpdate(); // Notify parent component
    } catch (error) {
      console.error("Error saving property:", error);
      alert(t("dashboard.propertyManager.saveError"));
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
      images: property.images || (property.image ? [property.image] : []),
    });
    setEditingId(property.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("dashboard.propertyManager.deleteConfirm"))) {
      try {
        // Delete from database (localStorage)
        await database.deleteProperty(type, id);
        loadProperties(); // Reload to reflect changes
        onUpdate(); // Notify parent component
      } catch (error) {
        console.error("Error deleting property:", error);
        alert(t("dashboard.propertyManager.deleteError"));
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
      images: [],
    });
    setEditingId(null);
    setShowForm(false);
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"][name="images"]'
    );
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if (loading) {
    return (
      <div className="loading">{t("dashboard.propertyManager.loading")}</div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>
          {t("dashboard.propertyManager.manageProperties")}{" "}
          {type === "sale"
            ? t("dashboard.propertyManager.sale")
            : t("dashboard.propertyManager.rent")}
        </h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> {t("dashboard.propertyManager.addNewProperty")}
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>
                {editingId
                  ? t("dashboard.propertyManager.editProperty")
                  : t("dashboard.propertyManager.addNewPropertyTitle")}
              </h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t("dashboard.propertyManager.title")} *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t("dashboard.propertyManager.location")} *</label>
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
                  <label>{t("dashboard.propertyManager.bedrooms")} *</label>
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
                  <label>{t("dashboard.propertyManager.bathrooms")} *</label>
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
                  <label>{t("dashboard.propertyManager.area")} *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder={t("dashboard.propertyManager.areaPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t("dashboard.propertyManager.price")} *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={
                    type === "sale"
                      ? t("dashboard.propertyManager.pricePlaceholderSale")
                      : t("dashboard.propertyManager.pricePlaceholderRent")
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.propertyManager.description")} *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.propertyManager.images")}</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                  title={t("dashboard.propertyManager.imagesPlaceholder")}
                />
                {formData.images.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={image}
                            alt={t("common.preview", { number: index + 1 })}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              padding: "2px 6px",
                              backgroundColor: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </button>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "4px",
                              left: "4px",
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                            }}
                          >
                            {index + 1}/{formData.images.length}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      {formData.images.length}{" "}
                      {formData.images.length === 1
                        ? t("dashboard.propertyManager.image")
                        : t("dashboard.propertyManager.images")}
                    </p>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  {t("dashboard.propertyManager.cancel")}
                </button>
                <button type="submit" className="save-btn">
                  {editingId
                    ? t("dashboard.propertyManager.update")
                    : t("dashboard.propertyManager.add")}{" "}
                  {t("dashboard.propertyManager.property")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="properties-list">
        {properties.length === 0 ? (
          <div className="empty-state">
            {t("dashboard.propertyManager.noProperties")}
          </div>
        ) : (
          properties.map((property) => {
            const propertyImages = property.images || (property.image ? [property.image] : []);
            const firstImage = propertyImages[0];
            
            return (
              <div key={property.id} className="property-item">
                <div className="property-image-container">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={property.title}
                      className="property-thumbnail"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="property-image-placeholder"
                    style={{ display: firstImage ? "none" : "flex" }}
                  >
                    <span>📷</span>
                    <span>{t("dashboard.propertyManager.noImage")}</span>
                  </div>
                  {propertyImages.length > 1 && (
                    <div className="property-image-count">
                      +{propertyImages.length - 1}
                    </div>
                  )}
                </div>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  <div className="property-details">
                    <span>
                      {property.bedrooms} {t("dashboard.propertyManager.beds")}
                    </span>
                    <span>
                      {property.bathrooms} {t("dashboard.propertyManager.baths")}
                    </span>
                    <span>{property.area}</span>
                  </div>
                  <p className="property-price">{property.price}</p>
                </div>
                <div className="property-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(property)}
                  >
                    <FaEdit /> {t("dashboard.propertyManager.edit")}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(property.id)}
                  >
                    <FaTrash /> {t("dashboard.propertyManager.delete")}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PropertyManager;
