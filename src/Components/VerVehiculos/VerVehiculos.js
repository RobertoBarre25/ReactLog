import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerVehiculos.css";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = window.pdfMake.vfs;

const VerVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [mantenimientoFiltro, setMantenimientoFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // ID del vehículo que se está editando
  const [formData, setFormData] = useState({}); // Datos del formulario de edición
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate();

  // Obtener los vehículos de la API
  const fetchVehiculos = async () => {
    try {
      const response = await fetch(
        "https://apimantenimiento.onrender.com/vehiculo/consultar"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setVehiculos(data);
      setFilteredVehiculos(data);
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
      const coincideBusqueda =
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.ano.toString().includes(searchTerm) ||
        vehiculo.kilometraje.toString().includes(searchTerm) ||
        vehiculo.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(vehiculo.ultima_inspeccion)
          .toLocaleDateString()
          .includes(searchTerm) ||
        vehiculo.estado_anomalia_id.toString().includes(searchTerm) ||
        (vehiculo.requiere_mantenimiento ? "sí" : "no").includes(
          searchTerm.toLowerCase()
        );

      const coincideTipo =
        tipoFiltro === "" ||
        vehiculo.modelo.toLowerCase().includes(tipoFiltro.toLowerCase());

      const coincideMantenimiento =
        mantenimientoFiltro === "" ||
        (mantenimientoFiltro === "si" && vehiculo.requiere_mantenimiento) ||
        (mantenimientoFiltro === "no" && !vehiculo.requiere_mantenimiento);

      return coincideBusqueda && coincideTipo && coincideMantenimiento;
    });
    setFilteredVehiculos(resultadosFiltrados);
  }, [searchTerm, tipoFiltro, mantenimientoFiltro, vehiculos]);

  // Función para eliminar un vehículo
  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás autenticado. Inicia sesión para continuar.");
      }

      const response = await fetch(
        `https://apimantenimiento.onrender.com/vehiculo/eliminar/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el vehículo");
      }

      fetchVehiculosConToken(); // Actualiza la lista de vehículos
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Función para abrir el modal de edición
  const handleEditar = (id) => {
    const vehiculo = vehiculos.find((v) => v.id === id);
    setFormData(vehiculo);
    setEditingId(id);
    setIsModalOpen(true); // Abrir el modal
  };
  const obtenerToken = async () => {
    try {
      const response = await fetch(
        "https://apimantenimiento.onrender.com/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_usuario: "roberto", // Nombre de usuario
            con_usuario: "1234", // Contraseña
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        throw new Error(
          `Error al autenticarse: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const token = data.token;

      // Guardar el token en localStorage
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      console.error("Error al obtener el token:", error);
      return null;
    }
  };

  // Obtener el token al montar el componente
  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await obtenerToken();
      if (newToken) {
        console.log("Token obtenido y almacenado:", newToken);
      } else {
        console.error("No se pudo obtener el token.");
      }
    };

    fetchToken();
  }, []);

  // Obtener los vehículos de la API
  const fetchVehiculosConToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás autenticado. Inicia sesión para continuar.");
      }

      const response = await fetch(
        "https://apimantenimiento.onrender.com/vehiculo/consultar",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const data = await response.json();
      setVehiculos(data);
      setFilteredVehiculos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás autenticado. Inicia sesión para continuar.");
      }

      // Formatea la fecha correctamente
      const formattedData = {
        ...formData,
        ultima_inspeccion: formData.ultima_inspeccion.split("T")[0], // Convierte "2024-03-15T00:00:00.000Z" a "2024-03-15"
      };

      const response = await fetch(
        `https://apimantenimiento.onrender.com/vehiculo/editar/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData), // Envía los datos formateados
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData); // Muestra el error del servidor
        throw new Error(errorData.message || "Error al actualizar el vehículo");
      }

      fetchVehiculosConToken(); // Actualiza la lista de vehículos
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Cargar los vehículos al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert(
        "No estás autenticado. Redirigiendo a la página de inicio de sesión..."
      );
      navigate("/login");
    } else {
      fetchVehiculosConToken();
    }
  }, [navigate]);

  // Función para manejar cambios en el formulario de edición
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleAgregar = () => {
    navigate("/agregar-vehiculo");
  };

  // Función para generar el PDF con pdfmake
  const generarPDF = async () => {
    // (Código de generación de PDF...)
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
        <div className="botones">
          <button onClick={handleAgregar} className="agregar-button">
            Agregar Vehículo
          </button>
          <button onClick={generarPDF} className="pdf-button">
            Generar PDF
          </button>
        </div>
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
                  <td>
                    {new Date(vehiculo.ultima_inspeccion).toLocaleDateString()}
                  </td>
                  <td>{vehiculo.estado_anomalia_id}</td>
                  <td>{vehiculo.requiere_mantenimiento ? "Sí" : "No"}</td>
                  <td>
                    <div className="acciones">
                      <button
                        onClick={() => handleEditar(vehiculo.id)}
                        className="editar-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(vehiculo.id)}
                        className="eliminar-button"
                      >
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

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Vehículo</h2>
            <form>
              <label>Modelo:</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
              />
              <label>Año:</label>
              <input
                type="number"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
              />
              <label>Kilometraje:</label>
              <input
                type="number"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleChange}
              />
              <label>Estado:</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
              <label>Última Inspección:</label>
              <input
                type="date"
                name="ultima_inspeccion"
                value={formData.ultima_inspeccion}
                onChange={handleChange}
              />
              <label>Estado Anomalía:</label>
              <input
                type="number"
                name="estado_anomalia_id"
                value={formData.estado_anomalia_id}
                onChange={handleChange}
              />
              <label>Requiere Mantenimiento:</label>
              <select
                name="requiere_mantenimiento"
                value={formData.requiere_mantenimiento}
                onChange={handleChange}
              >
                <option value={true}>Sí</option>
                <option value={false}>No</option>
              </select>
              <div className="modal-buttons">
                <button type="button" onClick={handleGuardar}>
                  Guardar
                </button>
                <button type="button" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerVehiculos;
