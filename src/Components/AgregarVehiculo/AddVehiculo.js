import React, { useState, useEffect } from 'react';
import './AddVehiculo.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const AddVehiculo = () => {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    id: '',
    modelo: '',
    ano: '',
    kilometraje: '',
    estado: '',
    ultima_inspeccion: '',
    estado_anomalia_id: '',
    requiere_mantenimiento: '',
  });

  // Estados para mensajes, token, carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  // Función para obtener el token de autenticación
  const obtenerToken = async () => {
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_usuario: 'roberto', // Nombre de usuario
          con_usuario: '1234', // Contraseña
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Captura los detalles del error
        console.error('Detalles del error:', errorData);
        throw new Error(`Error al autenticarse: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.token; // Suponiendo que la API devuelve el token en un campo llamado "token"
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  };

  // Obtener el token al montar el componente
  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await obtenerToken();
      if (newToken) {
        setToken(newToken);
      }
    };

    fetchToken();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificar si el token está presente
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    // Preparar los datos para enviar
    const dataToSend = {
      ...formData,
      id: parseInt(formData.id, 10),
      ano: parseInt(formData.ano, 10),
      kilometraje: formData.kilometraje.toString(),
      estado_anomalia_id: parseInt(formData.estado_anomalia_id, 10),
      requiere_mantenimiento: formData.requiere_mantenimiento === '1',
      ultima_inspeccion: formData.ultima_inspeccion.split('T')[0],
    };

    try {
      // Enviar la solicitud para crear el vehículo
      const response = await fetch('https://apimantenimiento.onrender.com/vehiculo/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Usar el token obtenido
        },
        body: JSON.stringify(dataToSend),
      });

      // Manejar errores de la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
        throw new Error('Error al enviar los datos');
      }

      // Procesar la respuesta exitosa
      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      // Mostrar SweetAlert de éxito
      Swal.fire({
        title: "Vehiculo creado correctamente!",
        icon: "success",
        draggable: true,      
        confirmButtonText: 'Aceptar',
      });

      // Limpiar el formulario después de un envío exitoso
      setFormData({
        id: '',
        modelo: '',
        ano: '',
        kilometraje: '',
        estado: '',
        ultima_inspeccion: '',
        estado_anomalia_id: '',
        requiere_mantenimiento: '',
      });
    } catch (error) {
      // Manejar errores en la solicitud
      console.error('Error:', error);

      // Mostrar SweetAlert de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el vehículo. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      // Finalizar el estado de carga
      setLoading(false);
    }
  };

  return (
    <div className="add-vehiculo-container">
      <h1>Agregar Vehículo</h1>

      {/* Formulario para agregar un vehículo */}
      <form className="add-vehiculo-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input
              type="number"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Ej: 1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ano">Año</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              placeholder="Ej: 2020"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Ej: Camión A"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="kilometraje">Kilometraje</label>
            <input
              type="number"
              id="kilometraje"
              name="kilometraje"
              value={formData.kilometraje}
              onChange={handleChange}
              placeholder="Ej: 1500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un estado</option>
              <option value="En servicio">En servicio</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Fuera de servicio">Fuera de servicio</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ultima_inspeccion">Última Inspección</label>
          <input
            type="datetime-local"
            id="ultima_inspeccion"
            name="ultima_inspeccion"
            value={formData.ultima_inspeccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estado_anomalia_id">Estado de Anomalía</label>
            <select
              id="estado_anomalia_id"
              name="estado_anomalia_id"
              value={formData.estado_anomalia_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un estado</option>
              <option value="1">1 - Bien</option>
              <option value="2">2 - Fallos Imprevistos</option>
              <option value="3">3 - Desgaste/Anomalias </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="requiere_mantenimiento">¿Requiere Mantenimiento?</label>
            <select
              id="requiere_mantenimiento"
              name="requiere_mantenimiento"
              value={formData.requiere_mantenimiento}
              onChange={handleChange}
              required
            >
              <option value="0">No</option>
              <option value="1">Sí</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Agregar Vehículo'}
        </button>
      </form>
    </div>
  );
};

export default AddVehiculo;