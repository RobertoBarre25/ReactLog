// src/Vehiculos.js
import React, { useEffect, useState } from 'react';
import './Principal.css';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la API
  const fetchVehiculos = async () => {
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/vehiculo/consultar');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Llamar a la función al cargar el componente
  useEffect(() => {
    fetchVehiculos();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="vehiculos-container">
      {vehiculos.map((vehiculo) => (
        <div key={vehiculo.id} className="vehiculo-card">
          <h2>{vehiculo.modelo}</h2>
          <p><strong>Año:</strong> {vehiculo.ano}</p>
          <p><strong>Kilometraje:</strong> {vehiculo.kilometraje} km</p>
          <p><strong>Estado:</strong> {vehiculo.estado}</p>
          <p><strong>Última inspección:</strong> {new Date(vehiculo.ultima_inspeccion).toLocaleDateString()}</p>
          {vehiculo.requiere_mantenimiento === 1 ? (
            <span className="mantenimiento-label requerido">Requiere Mantenimiento</span>
          ) : (
            <span className="mantenimiento-label ok">En buen estado</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Vehiculos;