import { useState, useEffect } from "react";
import "../../style/Dashboard.modules.css";
import database from "../../services/database";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function CarManager({ onUpdate }) {
  const { t } = useTranslation();

  // Translate fuel and transmission types for display
  const translateFuel = (fuel) => {
    const fuelMap = {
      Petrol: t("dashboard.carManager.petrol"),
      Diesel: t("dashboard.carManager.diesel"),
      Hybrid: t("dashboard.carManager.hybrid"),
      Electric: t("dashboard.carManager.electric"),
    };
    return fuelMap[fuel] || fuel;
  };

  const translateTransmission = (transmission) => {
    const transmissionMap = {
      Automatic: t("dashboard.carManager.automatic"),
      Manual: t("dashboard.carManager.manual"),
      CVT: t("dashboard.carManager.cvt"),
    };
    return transmissionMap[transmission] || transmission;
  };

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
    images: [],
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(t("dashboard.carManager.invalidImageType"));
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(t("dashboard.carManager.imageTooLarge"));
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
      const newCar = {
        ...formData,
        year: parseInt(formData.year),
      };

      if (editingId) {
        // Update existing car - all changes saved to database (localStorage)
        await database.updateCar(editingId, newCar);
      } else {
        // Add new car - saved to database (localStorage)
        await database.addCar(newCar);
      }

      resetForm();
      loadCars(); // Reload to reflect changes
      onUpdate(); // Notify parent component
    } catch (error) {
      console.error("Error saving car:", error);
      alert(t("dashboard.carManager.saveError"));
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
      images: car.images || (car.image ? [car.image] : []),
    });
    setEditingId(car.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("dashboard.carManager.deleteConfirm"))) {
      try {
        // Delete from database (localStorage)
        await database.deleteCar(id);
        loadCars(); // Reload to reflect changes
        onUpdate(); // Notify parent component
      } catch (error) {
        console.error("Error deleting car:", error);
        alert(t("dashboard.carManager.deleteError"));
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
    return <div className="loading">{t("dashboard.carManager.loading")}</div>;
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>{t("dashboard.carManager.manageCars")}</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> {t("dashboard.carManager.addNewCar")}
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h3>
                {editingId
                  ? t("dashboard.carManager.editCar")
                  : t("dashboard.carManager.addNewCarTitle")}
              </h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t("dashboard.carManager.title")} *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t("dashboard.carManager.year")} *</label>
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
                  <label>{t("dashboard.carManager.mileage")} *</label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder={t("dashboard.carManager.mileagePlaceholder")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t("dashboard.carManager.fuelType")} *</label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      {t("dashboard.carManager.selectFuelType")}
                    </option>
                    <option value="Petrol">
                      {t("dashboard.carManager.petrol")}
                    </option>
                    <option value="Diesel">
                      {t("dashboard.carManager.diesel")}
                    </option>
                    <option value="Hybrid">
                      {t("dashboard.carManager.hybrid")}
                    </option>
                    <option value="Electric">
                      {t("dashboard.carManager.electric")}
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("dashboard.carManager.transmission")} *</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      {t("dashboard.carManager.selectTransmission")}
                    </option>
                    <option value="Automatic">
                      {t("dashboard.carManager.automatic")}
                    </option>
                    <option value="Manual">
                      {t("dashboard.carManager.manual")}
                    </option>
                    <option value="CVT">{t("dashboard.carManager.cvt")}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>{t("dashboard.carManager.price")} *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={t("dashboard.carManager.pricePlaceholder")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.carManager.description")} *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.carManager.images")}</label>
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
                  title={t("dashboard.carManager.imagesPlaceholder")}
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
                        ? t("dashboard.carManager.image")
                        : t("dashboard.carManager.images")}
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
                  {t("dashboard.carManager.cancel")}
                </button>
                <button type="submit" className="save-btn">
                  {editingId
                    ? t("dashboard.carManager.update")
                    : t("dashboard.carManager.add")}{" "}
                  {t("dashboard.carManager.car")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="properties-list">
        {cars.length === 0 ? (
          <div className="empty-state">{t("dashboard.carManager.noCars")}</div>
        ) : (
          cars.map((car) => {
            const carImages = car.images || (car.image ? [car.image] : []);
            const firstImage = carImages[0];
            
            return (
              <div key={car.id} className="property-item">
                <div className="property-image-container">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={car.title}
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
                    <span>🚗</span>
                    <span>{t("dashboard.carManager.noImage")}</span>
                  </div>
                  {carImages.length > 1 && (
                    <div className="property-image-count">
                      +{carImages.length - 1}
                    </div>
                  )}
                </div>
                <div className="property-info">
                  <h3>{car.title}</h3>
                  <p className="property-location">
                    {t("dashboard.carManager.yearLabel")}: {car.year}
                  </p>
                  <div className="property-details">
                    <span>{car.mileage}</span>
                    <span>{translateFuel(car.fuel)}</span>
                    <span>{translateTransmission(car.transmission)}</span>
                  </div>
                  <p className="property-price">{car.price}</p>
                </div>
                <div className="property-actions">
                  <button className="edit-btn" onClick={() => handleEdit(car)}>
                    <FaEdit /> {t("dashboard.carManager.edit")}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(car.id)}
                  >
                    <FaTrash /> {t("dashboard.carManager.delete")}
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

export default CarManager;
