import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../style/ImageCarousel.modules.css";

function ImageCarousel({ images, fallbackEmoji = "🏠", alt = "Image" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div className="carousel-image-container">{fallbackEmoji}</div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-carousel">
      <div className="carousel-image-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentIndex ? "active" : ""
            }`}
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              onError={(e) => {
                e.target.style.display = "none";
                const parent = e.target.parentElement;
                if (parent && !parent.textContent.includes(fallbackEmoji)) {
                  parent.textContent = fallbackEmoji;
                }
              }}
            />
          </div>
        ))}
        {images.length > 1 && (
          <>
            <button
              className="carousel-button carousel-button-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              className="carousel-button carousel-button-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <div className="carousel-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
