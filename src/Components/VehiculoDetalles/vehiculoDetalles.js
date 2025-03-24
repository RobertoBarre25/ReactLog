import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './vehiculoDEtalles.css'; // Asegúrate de importar el archivo CSS
import { useNavigate } from 'react-router-dom'; 
import pdfMake from 'pdfmake/build/pdfmake';

pdfMake.vfs = window.pdfMake.vfs;

const VehiculoDetalles = () => {
  const { id } = useParams(); // Obtenemos el id del vehículo desde la URL
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tipo_mantenimiento: '',
    fecha: '',
    descripcion: '',
    estado: 'Completado',
    costo: '',
    observaciones: '',
  });
  const navigate = useNavigate(); 
  let mantenimientosDelVehiculo = [];

  // Función para obtener los detalles de un vehículo
  const fetchVehiculoDetalles = async () => {
    try {
      const response = await fetch(`https://apimantenimiento.onrender.com/vehiculo/consultar/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles');
      }
      const data = await response.json();
      setVehiculo(data);
      const tipoMantenimiento =
      data.estado_anomalia_id === 2
        ? 'Correctivo'
        : data.estado_anomalia_id === 3
        ? 'Predictivo'
        : data.kilometraje > 20000
        ? 'Preventivo'
        : '';

    // Actualiza el estado formData con el tipo de mantenimiento calculado
    setFormData((prevData) => ({
      ...prevData,
      tipo_mantenimiento: tipoMantenimiento, // Asigna el tipo de mantenimiento calculado
    }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculoDetalles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    console.log(formData);

    const dataToSend = {
        ...formData,
        // Convertir campos a tipos de datos correctos según lo que la API espera
        costo: parseFloat(formData.costo), // Convertir 'costo' a número
        vehiculo_id: parseInt(vehiculo.id, 10), // Asegúrate de que el 'vehiculo_id' es un número
        tipo_mantenimiento: formData.tipo_mantenimiento, // Mantener el tipo de mantenimiento
        fecha: formData.fecha.split('T')[0], // Asegurarnos de que la fecha está en formato 'YYYY-MM-DD'
        descripcion: formData.descripcion, // La descripción se mantiene como string
        estado: formData.estado, // Estado como string
        observaciones: formData.observaciones, // Observaciones como string
      };

    // Aquí puedes hacer un POST para enviar el mantenimiento
    try {
      const response = await fetch('https://apimantenimiento.onrender.com/mantenimiento/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el mantenimiento');
      }

      // Si la API responde correctamente, podrías mostrar un mensaje de éxito
      alert('Mantenimiento registrado correctamente');
      navigate('/home');
    } catch (error) {
      alert('Error al registrar el mantenimiento: ' + error.message);
      console.log(formData);
    }
  };

  const fetchMantenimientos = async () => {
    try {
      const response = await fetch(`https://apimantenimiento.onrender.com/mantenimiento/consultar?vehiculo_id=${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los mantenimientos');
      }
      const data = await response.json();

      // Filtrar los mantenimientos para solo los que coinciden con el vehiculo_id
      mantenimientosDelVehiculo = data.filter((mantenimiento) => mantenimiento.vehiculo_id === parseInt(id, 10));
      console.log(mantenimientosDelVehiculo);
      generarPDF();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async () => {
    // Función para convertir una imagen desde una URL a dataURL
    const imageUrlToDataURL = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
  
    // Convertir la imagen a dataURL
    const logoDataURL = await imageUrlToDataURL('https://cdn-icons-png.flaticon.com/128/5968/5968374.png');
  
    // Definir el contenido del PDF
    const docDefinition = {
      content: [
        // Encabezado con logo y título
        {
          columns: [
            {
              image: logoDataURL, // Usar la imagen en formato dataURL
              width: 50, // Tamaño del logo reducido a 50px
              alignment: 'left',
            },
            {
              text: 'Reporte de Vehículos',
              style: 'header',
              alignment: 'right',
              margin: [0, 10, 0, 0], // Margen superior ajustado
            },
          ],
        },
  
        // Espacio entre el encabezado y la tabla
        { text: '\n\n' },
  
        // Tabla de vehículos (como ya tienes)
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Modelo', style: 'tableHeader' },
                { text: 'Año', style: 'tableHeader' },
                { text: 'Kilometraje', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' },
                { text: 'Última Inspección', style: 'tableHeader' },
                { text: 'Estado Anomalía', style: 'tableHeader' },
                { text: 'Requiere Mantenimiento', style: 'tableHeader' },
              ],
              [
                { text: vehiculo.id, style: 'tableCell' },
                { text: vehiculo.modelo, style: 'tableCell' },
                { text: vehiculo.ano, style: 'tableCell' },
                { text: vehiculo.kilometraje, style: 'tableCell' },
                { text: vehiculo.estado, style: 'tableCell' },
                { text: new Date(vehiculo.ultima_inspeccion).toLocaleDateString(), style: 'tableCell' },
                { text: vehiculo.estado_anomalia_id, style: 'tableCell' },
                { text: vehiculo.requiere_mantenimiento ? 'Sí' : 'No', style: 'tableCell' },
              ],
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#4CAF50' : rowIndex % 2 === 0 ? '#F5F5F5' : null),
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 8,
            paddingBottom: () => 8,
            paddingLeft: () => 5,
            paddingRight: () => 5,
          },
        },
  
        // Espacio entre la tabla y la tabla de mantenimientos
        { text: '\n\n' },
  
        // Título de la tabla de mantenimientos
        {
          text: 'Mantenimientos del Vehículo',
          style: 'subheader',
        },
  
        // Tabla de mantenimientos
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Tipo Mantenimiento', style: 'tableHeader' },
                { text: 'Costo', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Fecha', style: 'tableHeader' },
              ],
              ...mantenimientosDelVehiculo.map((mantenimiento) => [
                { text: mantenimiento.id, style: 'tableCell' },
                { text: mantenimiento.tipo_mantenimiento, style: 'tableCell' },
                { text: `$${mantenimiento.costo}`, style: 'tableCell' },
                { text: mantenimiento.descripcion, style: 'tableCell' },
                { text: new Date(mantenimiento.fecha).toLocaleDateString(), style: 'tableCell' },
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#4CAF50' : rowIndex % 2 === 0 ? '#F5F5F5' : null),
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingTop: () => 8,
            paddingBottom: () => 8,
            paddingLeft: () => 5,
            paddingRight: () => 5,
          },
        },
  
        // Espacio entre la tabla y la leyenda
        { text: '\n\n' },
  
        // Leyenda de "Estado Anomalía"
        {
          text: 'Leyenda de Estado Anomalía:',
          style: 'subheader',
        },
        {
          ul: [
            { text: '1 - Bien', style: 'listItem' },
            { text: '2 - Fallos imprevistos', style: 'listItem' },
            { text: '3 - Desgaste/Anomalías', style: 'listItem' },
          ],
        },
  
        // Pie de página
        {
          text: `Generado el: ${new Date().toLocaleDateString()}`,
          style: 'footer',
          alignment: 'right',
          margin: [0, 20, 0, 0],
        },
      ],
  
      // Estilos personalizados
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#2196F3',
          alignment: 'center',
          borderRadius: 5,
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#2196F3',
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#FFFFFF',
          fillColor: '#2196F3',
          padding: [8, 0, 8, 0],
          alignment: 'center',
        },
        tableCell: {
          fontSize: 11,
          color: '#333333',
          padding: [5, 0, 5, 0],
          alignment: 'center',
        },
        listItem: {
          fontSize: 12,
          color: '#333333',
          margin: [0, 5, 0, 5],
        },
        footer: {
          fontSize: 10,
          color: '#777777',
          italic: true,
        },
      },
    };
  
    // Crear y descargar el PDF
    pdfMake.createPdf(docDefinition).download('reporte_mantenimientos.pdf');
  };
  
  

  if (loading) {
    return <div className="loading">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const tipoMantenimiento =
    vehiculo.estado_anomalia_id === 2
      ? 'Correctivo'
      : vehiculo.estado_anomalia_id === 3
      ? 'Predictivo'
      : vehiculo.kilometraje > 20000
      ? 'Preventivo'
      : '';
      
      const dynamicPaddingTop = vehiculo.requiere_mantenimiento === 1 ? '700px' : '100px';

      return (
        <div className="vehiculo-detalles">
          {/* Card izquierdo - Información del vehículo */}
          <div className="vehiculo-info">
            <h2>{vehiculo.modelo}</h2>
            <p><strong>Año:</strong> {vehiculo.ano}</p>
            <p><strong>Kilometraje:</strong> {vehiculo.kilometraje} km</p>
            <p><strong>Estado:</strong> {vehiculo.estado}</p>
            <p><strong>Última inspección:</strong> {new Date(vehiculo.ultima_inspeccion).toLocaleDateString()}</p>
            <p><strong>Requiere Mantenimiento:</strong> {vehiculo.requiere_mantenimiento === 1 ? 'Sí' : 'No'}</p>
            <div className="reporte">
              <h2>Reporte de vehiculo</h2>
              <button onClick={fetchMantenimientos}>Generar Reporte</button>
            </div>
          </div>
      
          {/* Card derecho - Formulario de mantenimiento (solo si es necesario) */}
          {vehiculo.requiere_mantenimiento === 1 && (
            <div className="mantenimiento-form">
              <h3>Registrar Proceso de Mantenimiento</h3>
              <form onSubmit={handleSubmit}>
                {/* Primera fila de campos */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Tipo de Mantenimiento</label>
                    <input
                      type="text"
                      name="tipo_mantenimiento"
                      value={tipoMantenimiento}
                      disabled
                      readOnly
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
      
                {/* Segunda fila de campos */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="Completado">Completado</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Costo</label>
                    <input
                      type="number"
                      name="costo"
                      value={formData.costo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
      
                {/* Campos de ancho completo */}
                <div style={{ marginBottom: '18px' }}>
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>
      
                <div style={{ marginBottom: '18px' }}>
                  <label>Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                  />
                </div>
      
                <button type="submit">Registrar Mantenimiento</button>
              </form>
            </div>
          )}
        </div>
      );
};

export default VehiculoDetalles;
