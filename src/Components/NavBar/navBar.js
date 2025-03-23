// src/NavBar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navBar.css';

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Logística App</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/vehiculos"
            className={location.pathname === '/vehiculos' ? 'active' : ''}
          >
            Ver Vehículos
          </Link>
        </li>
        <li>
          <Link
            to="/agregar-vehiculo" // Ruta para agregar vehículo
            className={location.pathname === '/agregar-vehiculo' ? 'active' : ''}
          >
            Agregar Vehículo
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;