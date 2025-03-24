import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login"; 
import Home from "./Components/Principal/principal"; 
import NavBar from "./Components/NavBar/navBar";
import AddVehiculo from "./Components/AgregarVehiculo/AddVehiculo";
import Vehiculos from "./Components/VerVehiculos/VerVehiculos";
import VehiculoDetalles from './Components/VehiculoDetalles/vehiculoDetalles';
import React from "react";
import { AuthProvider } from "./Components/Context/AuthContext"; // Importa el AuthProvider

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/agregar-vehiculo" element={<AddVehiculo />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/vehiculo/:id" element={<VehiculoDetalles />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider> {/* Envuelve todo con AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}