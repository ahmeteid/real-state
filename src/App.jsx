import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Sale_Home from "./pages/Sale_Home";
import Rent_Home from "./pages/Rent_Home";
import Car_Sale from "./pages/Car_Sale";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/Home_Sale" element={<Sale_Home />} />
        <Route path="/Home_Rent" element={<Rent_Home />} />
        <Route path="/Car_Sale" element={<Car_Sale />} />
      </Routes>
    </>
  );
}

export default App;
