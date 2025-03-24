import React, { useEffect, useState } from 'react';
import './Principal.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para obtener los datos
  const fetchVehiculos = async () => {
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/vehiculo/consultar');
      if (!response.ok) throw new Error('Error al obtener los datos');
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (vehiculoId) => {
    navigate(`/vehiculo/${vehiculoId}`);
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  // Función para dividir los vehículos en filas de 5
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const vehiculosPorFilas = chunkArray(vehiculos, 5);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="vehiculos-container">
      <div className="vehiculos-rows">
        {vehiculosPorFilas.map((fila, index) => (
          <div key={index} className="vehiculos-row">
            {fila.map((vehiculo) => (
              <div key={vehiculo.id} className="vehiculo-card">
                <div className="card-header">
                  <h2>{vehiculo.modelo}</h2>
                </div>
                <div className="card-content">
                  <p>
                    <strong>Año</strong>
                    <span>{vehiculo.ano}</span>
                  </p>
                  <p>
                    <strong>Km</strong>
                    <span>{vehiculo.kilometraje} km</span>
                  </p>
                  <p>
                    <strong>Estado</strong>
                    <span>{vehiculo.estado}</span>
                  </p>
                  <p>
                    <strong>Revisión</strong>
                    <span>{new Date(vehiculo.ultima_inspeccion).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="card-footer">
                  <button 
                    className="mostrar-btn"
                    onClick={() => handleShowDetails(vehiculo.id)}
                  >
                    <FiArrowRight size={12} /> Detalles
                  </button>
                  {vehiculo.requiere_mantenimiento === 1 ? (
                    <span className="mantenimiento-label requerido">
                      <FiAlertTriangle size={12} /> Revisar
                    </span>
                  ) : (
                    <span className="mantenimiento-label ok">
                      <FiCheckCircle size={12} /> Óptimo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;