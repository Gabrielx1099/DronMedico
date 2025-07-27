import React, { useState, useEffect } from 'react';

const Alertas = () => {
  const [alertaActual, setAlertaActual] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [faseInicialCompletada, setFaseInicialCompletada] = useState(false);

  const provincias = [
    'Arequipa', 'Cusco', 'Trujillo', 'Huancayo', 'Piura', 'Iquitos',
    'Chiclayo', 'Ayacucho', 'Tacna', 'Puno', 'Cajamarca', 'Ica'
  ];

  const tiposAlerta = [
    {
      tipo: 'VIENTO_FUERTE',
      titulo: 'Vientos Fuertes',
      mensaje: 'Vientos de hasta 45 km/h detectados',
      severidad: 'high',
      icono: '💨',
      color: '#ea580c',
      fondo: '#ffedd5',
    },
    {
      tipo: 'LLUVIA_INTENSA',
      titulo: 'Lluvia Intensa',
      mensaje: 'Precipitaciones intensas en ruta',
      severidad: 'high',
      icono: '🌧️',
      color: '#3b82f6',
      fondo: '#dbeafe',
    },
    {
      tipo: 'NIEBLA_DENSA',
      titulo: 'Niebla Densa',
      mensaje: 'Visibilidad reducida a menos de 100m',
      severidad: 'medium',
      icono: '🌫️',
      color: '#6b7280',
      fondo: '#f3f4f6',
    },
    {
      tipo: 'GRANIZO',
      titulo: 'Granizo',
      mensaje: 'Caída de granizo reportada',
      severidad: 'high',
      icono: '🌨️',
      color: '#7c3aed',
      fondo: '#ede9fe',
    }
  ];

  const alertaInicio = {
    tipo: 'INICIANDO',
    titulo: 'Dron Iniciando',
    mensaje: 'Preparando sistemas de vuelo',
    severidad: 'low',
    icono: '🚁',
    color: '#2563eb',
    fondo: '#dbeafe',
  };

  const alertaDespejado = {
    tipo: 'DESPEJADO',
    titulo: 'Condiciones Favorables',
    mensaje: 'Clima despejado y sin obstáculos',
    severidad: 'low',
    icono: '☀️',
    color: '#10b981',
    fondo: '#d1fae5',
  };

  const generarAlertaAleatoria = () => {
    const provincia = provincias[Math.floor(Math.random() * provincias.length)];
    const alertaTipo = tiposAlerta[Math.floor(Math.random() * tiposAlerta.length)];
    const hora = new Date().toLocaleTimeString();

    const nuevaAlerta = {
      id: Date.now(),
      provincia,
      hora,
      ...alertaTipo
    };

    setAlertaActual(nuevaAlerta);
    setHistorial(prev => [nuevaAlerta, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    const provinciaRandom = provincias[Math.floor(Math.random() * provincias.length)];
    const hora = new Date().toLocaleTimeString();

    // Mostrar primero "Dron Iniciando"
    const inicio = { ...alertaInicio, id: Date.now(), provincia: provinciaRandom, hora };
    setAlertaActual(inicio);
    setHistorial([inicio]);

    // Luego de 10 segundos mostrar "Condiciones Favorables"
    setTimeout(() => {
      const despejado = { ...alertaDespejado, id: Date.now(), provincia: provinciaRandom, hora: new Date().toLocaleTimeString() };
      setAlertaActual(despejado);
      setHistorial(prev => [despejado, ...prev.slice(0, 4)]);
    }, 10000);

    // Después de 20 segundos, empezar las alertas aleatorias cada 10s
    const alertaInterval = setTimeout(() => {
      setFaseInicialCompletada(true);
    }, 20000);

    return () => clearTimeout(alertaInterval);
  }, []);

  useEffect(() => {
    if (!faseInicialCompletada) return;
    const interval = setInterval(generarAlertaAleatoria, 10000);
    return () => clearInterval(interval);
  }, [faseInicialCompletada]);

  const severidadTexto = {
    low: 'NORMAL',
    medium: 'PRECAUCIÓN',
    high: 'ALERTA',
    critical: 'CRÍTICO'
  };

  const severidadColor = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#b91c1c'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '10px' }}>Sistema de Alertas de Dron</h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>
        Monitoreo en tiempo real de condiciones climáticas
      </p>

      {alertaActual && (
        <div style={{
          backgroundColor: alertaActual.fondo,
          borderLeft: `6px solid ${alertaActual.color}`,
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '28px' }}>{alertaActual.icono}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>{alertaActual.titulo}</h2>
                <small style={{ color: '#555' }}>{alertaActual.provincia} - {alertaActual.hora}</small>
              </div>
            </div>
            <span style={{
              backgroundColor: severidadColor[alertaActual.severidad],
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {severidadTexto[alertaActual.severidad]}
            </span>
          </div>
          <p style={{ marginTop: '12px', fontSize: '15px' }}>{alertaActual.mensaje}</p>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Historial de Alertas</h3>
        {historial.length === 0 ? (
          <p style={{ color: '#777' }}>No hay alertas registradas.</p>
        ) : (
          historial.map(alerta => (
            <div key={alerta.id} style={{
              border: `1px solid ${alerta.color}`,
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '10px',
              backgroundColor: alerta.fondo
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{alerta.icono}</span>
                <div style={{ flex: 1 }}>
                  <strong>{alerta.titulo}</strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>{alerta.provincia} - {alerta.hora}</p>
                </div>
                <span style={{
                  backgroundColor: severidadColor[alerta.severidad],
                  color: 'white',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  {severidadTexto[alerta.severidad]}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alertas;
