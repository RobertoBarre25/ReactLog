// src/AddVehiculo.js
import React, { useState } from 'react';
import './AddVehiculo.css';

const AddVehiculo = () => {
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

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convertir los campos necesarios
    const dataToSend = {
      ...formData,
      id: parseInt(formData.id, 10),
      ano: parseInt(formData.ano, 10),
      kilometraje: formData.kilometraje.toString(), // Convertir a cadena
      estado_anomalia_id: parseInt(formData.estado_anomalia_id, 10),
      requiere_mantenimiento: formData.requiere_mantenimiento === '1',
      ultima_inspeccion: formData.ultima_inspeccion.split('T')[0], // Formatear como YYYY-MM-DD
    };
  
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/vehiculo/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsIm5vbV91c3VhcmlvIjoiam9uIiwiaWF0IjoxNzQyNzQ1ODcyLCJleHAiOjE3NDI3NDk0NzJ9.72KE4-WszQJTyAfLc5qot_eTIoBsegCb0sW8DXhLQP8', // Token Bearer
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Obtener detalles del error
        console.error('Detalles del error:', errorData);
        throw new Error('Error al enviar los datos');
      }
  
      const result = await response.json();
      setMessage('Vehículo agregado correctamente');
      console.log('Respuesta del servidor:', result);
    } catch (error) {
      setMessage('Error al agregar el vehículo');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-vehiculo-container">
      <h1>Agregar Vehículo</h1>
      {message && <p className="message">{message}</p>}
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
              <option value="1">1 - Sin anomalías</option>
              <option value="2">2 - Anomalías menores</option>
              <option value="3">3 - Anomalías graves</option>
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

        <button type="submit" className="submit-button">
          Agregar Vehículo
        </button>
      </form>
    </div>
  );
};

export default AddVehiculo;