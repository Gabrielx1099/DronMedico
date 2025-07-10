import React, { useState, useEffect } from 'react';
import '../css/Historial.css';

const Historial = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetch('http://localhost:8081/api/solicitudes')
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(err => console.error('Error cargando solicitudes:', err));
  }, []);

  const toggleDetalles = async (solicitudId) => {
    if (detalles[solicitudId]) {
      setDetalles(prev => ({ ...prev, [solicitudId]: null }));
    } else {
      setLoading(prev => ({ ...prev, [solicitudId]: true }));
      try {
        const [medsRes, vuelosRes] = await Promise.all([
          fetch(`http://localhost:8081/api/solicitud-medicamentos/solicitud/${solicitudId}`).then(res => res.json()),
          fetch(`http://localhost:8081/api/vuelos/solicitud/${solicitudId}`).then(res => res.json())
        ]);

        const vuelo = vuelosRes.length > 0 ? vuelosRes[0] : null;
        const dron = vuelo?.dron ?? null;

        setDetalles(prev => ({
          ...prev,
          [solicitudId]: {
            medicamentos: medsRes,
            vuelo,
            dron
          }
        }));
      } catch (error) {
        console.error('Error obteniendo detalles:', error);
      } finally {
        setLoading(prev => ({ ...prev, [solicitudId]: false }));
      }
    }
  };

  return (
    <div className="contenedor-historial">
      {solicitudes.map(solicitud => (
        <div className="tarjeta-historial" key={solicitud.id}>
          <div className="tarjeta-content">
            <h3>Solicitud #{solicitud.id}</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <p><strong>📍 Destino</strong>{solicitud.destino}</p>
              </div>
              <div className="info-item">
                <p><strong>⚡ Prioridad</strong>{solicitud.prioridad}</p>
              </div>
              <div className="info-item">
                <p><strong>🌎 Región</strong>{solicitud.region}</p>
              </div>
              <div className="info-item">
                <p><strong>📊 Estado</strong>{solicitud.estadoSolicitud}</p>
              </div>
              <div className="info-item">
                <p><strong>📅 Fecha</strong>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <p><strong>⏰ Hora</strong>{new Date(solicitud.fechaSolicitud).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <button 
            className={`toggle-button ${detalles[solicitud.id] ? 'active' : ''}`}
            onClick={() => toggleDetalles(solicitud.id)}
            disabled={loading[solicitud.id]}
          >
            {loading[solicitud.id] ? 'Cargando...' : 
             detalles[solicitud.id] ? '▲ Ocultar detalles' : '▼ Ver más detalles'}
          </button>

          <div className={`detalles ${detalles[solicitud.id] ? 'show' : ''}`}>
            {detalles[solicitud.id] && (
              <div className="detalles-content">
                <div className="seccion-medicamentos">
                  <h4>🧪 Medicamentos Enviados</h4>
                  {detalles[solicitud.id].medicamentos.length === 0 ? (
                    <div className="empty-state">
                      <p>No se registraron medicamentos para esta solicitud.</p>
                    </div>
                  ) : (
                    detalles[solicitud.id].medicamentos.map((med) => (
                      <div key={med.id} className="med-box">
                        <p><strong>Nombre:</strong> {med.medicamento?.nombreComercial}</p>
                        <p><strong>Cantidad:</strong> {med.cantidad}</p>
                        <p><strong>Peso:</strong> {med.medicamento?.peso} kg</p>
                        <p><strong>Forma de administración:</strong> {med.medicamento?.formaAdministracion}</p>
                        <p><strong>Descripción de uso:</strong> {med.medicamento?.descripcionUso}</p>
                        <p><strong>Dolores tratados:</strong> {
                          Array.isArray(med.medicamento?.dolores)
                            ? med.medicamento.dolores.join(', ')
                            : (typeof med.medicamento?.dolores === 'string'
                                ? med.medicamento.dolores
                                : 'No especificado')
                        }</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="seccion-dron">
                  <h4>🚁 Dron Asignado</h4>
                  {detalles[solicitud.id].dron ? (
                    <div className="dron-box">
                      <p><strong>ID:</strong> {detalles[solicitud.id].dron.id}</p>
                      <p><strong>Modelo:</strong> {detalles[solicitud.id].dron.modelo}</p>
                      <p><strong>Identificador:</strong> {detalles[solicitud.id].dron.identificador}</p>
                      <p><strong>Capacidad:</strong> {detalles[solicitud.id].dron.capacidadKg} kg</p>
                      <p><strong>Batería:</strong> {detalles[solicitud.id].dron.nivelBateria}%</p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No se encontró información del dron asignado.</p>
                    </div>
                  )}
                </div>

                <div className="seccion-vuelo">
                  <h4>📦 Detalles del Vuelo</h4>
                  {detalles[solicitud.id].vuelo ? (
                    <div className="vuelo-box">
                      <p><strong>Estado:</strong> {detalles[solicitud.id].vuelo.estadoEntrega}</p>
                      <p><strong>Duración:</strong> {detalles[solicitud.id].vuelo.duracionMinutos} minutos</p>
                      <p><strong>Distancia:</strong> {detalles[solicitud.id].vuelo.distanciaKm} km</p>
                      <p><strong>Inicio:</strong> {new Date(detalles[solicitud.id].vuelo.fechaInicio).toLocaleString()}</p>
                      <p><strong>Fin:</strong> {detalles[solicitud.id].vuelo.fechaFin ? 
                        new Date(detalles[solicitud.id].vuelo.fechaFin).toLocaleString() : 
                        'En curso'}</p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No se registró información del vuelo.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Historial;