// src/Vehiculos.js
import React, { useEffect, useState } from 'react';
import './Principal.css';
import { useNavigate } from 'react-router-dom'; 

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

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
    // Función que maneja el clic en "Mostrar" y navega a una nueva página
    const handleShowDetails = (vehiculoId) => {
      // Aquí se puede redirigir a una vista de detalles con el id del vehículo
      navigate(`/vehiculo/${vehiculoId}`); // Redirige a la vista de detalles del vehículo
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
           <span className="requerido" onClick={() => handleShowDetails(vehiculo.id)}>
            Mostrar
          </span>
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