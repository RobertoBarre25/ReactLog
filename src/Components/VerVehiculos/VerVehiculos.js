// src/VerVehiculos.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerVehiculos.css';

const VerVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]); // Lista completa de vehículos
  const [filteredVehiculos, setFilteredVehiculos] = useState([]); // Lista filtrada
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [tipoFiltro, setTipoFiltro] = useState(''); // Filtro por tipo de vehículo
  const [mantenimientoFiltro, setMantenimientoFiltro] = useState(''); // Filtro por estado de mantenimiento
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obtener los vehículos de la API
  const fetchVehiculos = async () => {
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/vehiculo/consultar');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setVehiculos(data);
      setFilteredVehiculos(data); // Inicialmente, la lista filtrada es igual a la lista completa
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los vehículos al montar el componente
  useEffect(() => {
    fetchVehiculos();
  }, []);

  // Filtrar vehículos en tiempo real
  useEffect(() => {
    const resultadosFiltrados = vehiculos.filter((vehiculo) => {
      // Filtro por término de búsqueda
      const coincideBusqueda =
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.ano.toString().includes(searchTerm) ||
        vehiculo.kilometraje.toString().includes(searchTerm) ||
        vehiculo.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(vehiculo.ultima_inspeccion).toLocaleDateString().includes(searchTerm) ||
        vehiculo.estado_anomalia_id.toString().includes(searchTerm) ||
        (vehiculo.requiere_mantenimiento ? 'sí' : 'no').includes(searchTerm.toLowerCase());

      // Filtro por tipo de vehículo
      const coincideTipo =
        tipoFiltro === '' || vehiculo.modelo.toLowerCase().includes(tipoFiltro.toLowerCase());

      // Filtro por estado de mantenimiento
      const coincideMantenimiento =
        mantenimientoFiltro === '' ||
        (mantenimientoFiltro === 'si' && vehiculo.requiere_mantenimiento) ||
        (mantenimientoFiltro === 'no' && !vehiculo.requiere_mantenimiento);

      return coincideBusqueda && coincideTipo && coincideMantenimiento;
    });
    setFilteredVehiculos(resultadosFiltrados);
  }, [searchTerm, tipoFiltro, mantenimientoFiltro, vehiculos]);

  // Función para eliminar un vehículo
  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`https://apimantenimiento.onrender.com/vehiculo/eliminar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el vehículo');
      }

      // Actualizar la lista de vehículos después de eliminar
      fetchVehiculos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para editar un vehículo (redirigir a un formulario de edición)
  const handleEditar = (id) => {
    // Aquí puedes redirigir a un formulario de edición o abrir un modal
    console.log('Editar vehículo con ID:', id);
  };

  // Función para agregar un vehículo (redirigir a la vista /agregar-vehiculo)
  const handleAgregar = () => {
    navigate('/agregar-vehiculo'); // Redirigir a la vista de agregar vehículo
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ver-vehiculos-container">
      {/* Encabezado con título y botón */}
      <div className="header">
        <h1>Vehículos Registrados</h1>
        <button onClick={handleAgregar} className="agregar-button">
          Agregar Vehículo
        </button>
      </div>

      {/* Contenedor para los filtros y la tabla */}
      <div className="filtros-y-tabla">
        {/* Filtros */}
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar vehículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="buscador"
          />
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="filtro"
          >
            <option value="">Todos los tipos</option>
            <option value="camión">Camión</option>
            <option value="furgoneta">Furgoneta</option>
            <option value="trailer">Trailer</option>
          </select>
          <select
            value={mantenimientoFiltro}
            onChange={(e) => setMantenimientoFiltro(e.target.value)}
            className="filtro"
          >
            <option value="">Todos los estados</option>
            <option value="si">Requiere mantenimiento</option>
            <option value="no">No requiere mantenimiento</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="tabla-container">
          <table className="vehiculos-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Año</th>
                <th>Kilometraje</th>
                <th>Estado</th>
                <th>Última Inspección</th>
                <th>Estado Anomalía</th>
                <th>Requiere Mantenimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.ano}</td>
                  <td>{vehiculo.kilometraje}</td>
                  <td>{vehiculo.estado}</td>
                  <td>{new Date(vehiculo.ultima_inspeccion).toLocaleDateString()}</td>
                  <td>{vehiculo.estado_anomalia_id}</td>
                  <td>{vehiculo.requiere_mantenimiento ? 'Sí' : 'No'}</td>
                  <td>
                    <div className="acciones">
                      <button onClick={() => handleEditar(vehiculo.id)} className="editar-button">
                        Editar
                      </button>
                      <button onClick={() => handleEliminar(vehiculo.id)} className="eliminar-button">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VerVehiculos;