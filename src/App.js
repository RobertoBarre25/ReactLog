import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login"; 
import Home from "./Components/Principal/principal"; 
import NavBar from "./Components/NavBar/navBar"; // 
import AddVehiculo from "./Components/AgregarVehiculo/AddVehiculo";
import React from "react";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/agregar-vehiculo" element={<AddVehiculo />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}