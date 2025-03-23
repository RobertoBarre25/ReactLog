// src/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Para manejar rutas
import './navBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Alda's Logistic</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/vehiculos">Ver Vehículos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;