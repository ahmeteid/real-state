import "../style/About.modules.css";

function About() {
  return (
    <>
      <div className="about-container">
        <div className="about-header">
          <h1>About Real State</h1>
          <p>
            Welcome to Real State, your trusted partner in finding the perfect
            property. We specialize in connecting buyers, renters, and sellers
            with their dream homes and vehicles. With years of experience in the
            real estate market, we provide exceptional service and unmatched
            expertise.
          </p>
        </div>

        <div className="about-content">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Our mission is to make property transactions seamless and
              stress-free. We strive to provide transparent, honest, and
              professional services to all our clients, ensuring their complete
              satisfaction.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Vision</h2>
            <p>
              To become the leading real estate platform that transforms how
              people buy, rent, and sell properties. We envision a future where
              finding your perfect home is just a click away.
            </p>
          </div>

          <div className="about-card">
            <h2>Why Choose Us</h2>
            <p>
              We offer a comprehensive range of services including home sales,
              rentals, and car sales. Our team of experienced professionals is
              dedicated to helping you find exactly what you're looking for at
              the best possible prices.
            </p>
          </div>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Properties Sold</p>
          </div>
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Active Listings</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
