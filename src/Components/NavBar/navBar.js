// src/NavBar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Importa useAuth
import './navBar.css';
import { FiLogOut } from 'react-icons/fi';

const NavBar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // Ahora esto funcionará correctamente

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Alda's Logistic</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link
            to="/home"
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
            to="/agregar-vehiculo"
            className={location.pathname === '/agregar-vehiculo' ? 'active' : ''}
          >
            Agregar Vehículo
          </Link>
        </li>
        <li>
        <button onClick={logout} className="logout-button with-icon">
          <FiLogOut className="icon" />
          Cerrar sesión
        </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;