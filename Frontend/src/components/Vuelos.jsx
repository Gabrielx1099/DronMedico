import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SimuladorVuelo.css';

const Vuelos = () => {
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  const [vuelos, setVuelos] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [distanceMap, setDistanceMap] = useState({});
  const [timeRemainingMap, setTimeRemainingMap] = useState({});
  const [completedMap, setCompletedMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8081/api/vuelos/usuario/${userId}/pendientes`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener vuelos');
        return res.json();
      })
      .then(data => {
        setVuelos(data);
        data.forEach(vuelo => startFlightSimulation(vuelo.id));
      })
      .catch(err => console.error('Error obteniendo vuelos:', err));
  }, [userId]);

  const startFlightSimulation = (vueloId) => {
    const flightDuration = Math.floor(Math.random() * 60) + 120; // 120 - 180 seg
    const totalDistance = Math.floor(Math.random() * 3) + 3; // 3 - 6 km

    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 1;
      const progressPercent = Math.min((elapsed / flightDuration) * 100, 100);
      const distanceTraveled = (totalDistance * (elapsed / flightDuration)).toFixed(2);

      setProgressMap(prev => ({ ...prev, [vueloId]: progressPercent }));
      setDistanceMap(prev => ({ ...prev, [vueloId]: distanceTraveled }));
      setTimeRemainingMap(prev => ({ ...prev, [vueloId]: flightDuration - elapsed }));

      if (elapsed >= flightDuration) {
        clearInterval(interval);
        setCompletedMap(prev => ({ ...prev, [vueloId]: true }));
      }
    }, 1000);
  };

  const confirmarLlegada = async (vuelo) => {
    try {
      setLoading(true);
      const distanciaKm = parseFloat(distanceMap[vuelo.id]) || 0;
      const estadoFinal = 'exitoso';

      const resVuelo = await fetch(
        `http://localhost:8081/api/vuelos/${vuelo.id}/finalizar?estadoFinal=${estadoFinal}&distanciaKm=${distanciaKm}`,
        { method: 'PATCH' }
      );
      if (!resVuelo.ok) throw new Error('Error al finalizar vuelo');

      const resSolicitud = await fetch(
        `http://localhost:8081/api/solicitudes/${vuelo.solicitud.id}/estado?nuevoEstado=confirmado`,
        { method: 'PATCH' }
      );
      if (!resSolicitud.ok) throw new Error('Error al actualizar estado de solicitud');

      alert('✅ Entrega confirmada correctamente');

      // Obtener vuelos actualizados
      const updatedVuelos = await fetch(`http://localhost:8081/api/vuelos/usuario/${userId}/pendientes`);
      if (!updatedVuelos.ok) throw new Error('Error al obtener vuelos actualizados');
      const vuelosData = await updatedVuelos.json();
      setVuelos(vuelosData);

      // Guardar mapa actual de vuelos completados
      const completedIds = { ...completedMap };

      // Limpiar estados
      setProgressMap({});
      setDistanceMap({});
      setTimeRemainingMap({});
      setCompletedMap({});

      // Reiniciar vuelos no completados
      vuelosData.forEach(vuelo => {
        if (!completedIds[vuelo.id]) {
          startFlightSimulation(vuelo.id);
        }
      });
    } catch (err) {
      console.error('Error confirmando llegada:', err);
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la clase de color según el progreso
  const getProgressColorClass = (progress) => {
    if (progress <= 33) return 'progress-red';
    if (progress <= 66) return 'progress-yellow';
    return 'progress-green';
  };

  return (
    <div className="vuelo-container">
      <h2>Vuelos Actuales 🚁</h2>
      {vuelos.length === 0 ? (
        <p>No hay vuelos registrados.</p>
      ) : (
        vuelos.map(vuelo => (
          <div key={vuelo.id} className="vuelo-card">
            {/* Imagen del dron */}
            <div className="drone-image-container">
              <div className="drone-placeholder"></div>
            </div>
            
            <div className="flight-info">
              <div className="info-item">
                <strong>ID Vuelo</strong>
                <span>{vuelo.id}</span>
              </div>
              <div className="info-item">
                <strong>Solicitud</strong>
                <span>{vuelo.solicitud.id}</span>
              </div>
              <div className="info-item">
                <strong>Progreso</strong>
                <span>{(progressMap[vuelo.id] || 0).toFixed(0)}%</span>
              </div>
              <div className="info-item">
                <strong>Distancia</strong>
                <span>{distanceMap[vuelo.id] || 0} km</span>
              </div>
              <div className="info-item">
                <strong>Tiempo restante</strong>
                <span>{timeRemainingMap[vuelo.id] || 0} seg</span>
              </div>
            </div>

            {/* Barra de progreso con colores dinámicos */}
            <div className="progress-bar">
              <div
                className={`progress ${getProgressColorClass(progressMap[vuelo.id] || 0)}`}
                style={{ width: `${progressMap[vuelo.id] || 0}%` }}
              ></div>
            </div>

            {completedMap[vuelo.id] && (
              <button
                className="confirm-button"
                onClick={() => confirmarLlegada(vuelo)}
                disabled={loading}
              >
                {loading ? 'Confirmando...' : 'Confirmar llegada de envío'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Vuelos;