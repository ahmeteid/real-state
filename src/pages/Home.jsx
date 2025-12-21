import Services_Card from "../components/Services_Card";
import "../style/Home.modules.css";

function Home() {
  return (
    <>
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to Real State</h1>
          <p>
            Your one-stop destination for finding the perfect home, rental
            property, or vehicle. Explore our wide selection of properties and
            cars to find exactly what you're looking for.
          </p>
        </div>
        <Services_Card />
      </div>
    </>
  );
}

export default Home;
