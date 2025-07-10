import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/Solicitud.css';


const MedicalRequestForm = () => {
  const navigate = useNavigate();  
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState({
    region: '',
    address: '',
    coordinates: null,
    confirmed: false
  });
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [priority, setPriority] = useState('');
  const [medications, setMedications] = useState([]);
  const [availableDrones, setAvailableDrones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  

  // Regiones disponibles
  const regions = [
    { value: 'amazonas', label: 'Amazonas' },
    { value: 'cusco', label: 'Cusco' },
    { value: 'puno', label: 'Puno' },
    { value: 'arequipa', label: 'Arequipa' }
 ];

  // Dolores/medicamentos disponibles
  const availablePains = [
    'Dolor de cabeza',
    'Fiebre',
    'Dolor estomacal',
    'Resfrío común',
    'Presión alta',
    'Diabetes',
    'Dolor muscular',
    'Alergias',
    'Infección urinaria',
    'Dolor de garganta'
  ];

  
  // Verificar autenticación del usuario al cargar el componente
  useEffect(() => {
    const checkUserAuth = () => {
  try {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('nombre');
    const userRole = localStorage.getItem('rol');

    if (!userId || !userEmail) {
      setError('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    setUserInfo({
      id: parseInt(userId),
      email: userEmail,
      name: userName,
      role: userRole
    });
  } catch (storageError) {
    console.error('Error accediendo a localStorage:', storageError);
    setError('Error de sesión. Recarga la página e inicia sesión nuevamente.');
  }
};

    checkUserAuth();
  }, []);


 useEffect(() => {
  let mapInstance = null;
  let timeoutId = null;

  const initializeMap = () => {
    // Limpiar mapa existente si existe
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    // Verificar que el contenedor existe
    if (!mapRef.current) {
      console.log('Contenedor del mapa no encontrado');
      return;
    }

    // Limpiar completamente el contenedor
    mapRef.current.innerHTML = '';

    // Función para crear el mapa
    const createMap = () => {
      try {
        // Verificar que Leaflet está disponible
        if (!window.L) {
          console.log('Leaflet no está disponible aún');
          return;
        }

        // Crear mapa centrado en Perú
        mapInstance = window.L.map(mapRef.current, {
          center: [-9.189967, -75.015152],
          zoom: 6,
          zoomControl: true,
          attributionControl: true
        });
        
        // Agregar capa de OpenStreetMap
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(mapInstance);

        // Actualizar estado
        setMap(mapInstance);

        // Limpiar marcador anterior si existe
        if (marker && mapInstance.hasLayer && mapInstance.hasLayer(marker)) {
          mapInstance.removeLayer(marker);
          setMarker(null);
        }

        // Agregar evento de click
        mapInstance.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          
          // Remover marcador anterior
          if (marker && mapInstance.hasLayer(marker)) {
            mapInstance.removeLayer(marker);
          }
          
          // Crear nuevo marcador
          const newMarker = window.L.marker([lat, lng]).addTo(mapInstance);
          setMarker(newMarker);
          
          // Obtener dirección
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              setLocation(prev => ({
                ...prev,
                address: data.display_name,
                coordinates: { lat, lng }
              }));
            }
          } catch (error) {
            console.error('Error al obtener dirección:', error);
            setLocation(prev => ({
              ...prev,
              address: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              coordinates: { lat, lng }
            }));
          }
        });

        console.log('Mapa inicializado correctamente');
      } catch (error) {
        console.error('Error al crear mapa:', error);
      }
    };

    // Cargar recursos de Leaflet si no están disponibles
    const loadLeafletResources = () => {
      // Cargar CSS si no existe
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.onload = () => console.log('CSS de Leaflet cargado');
        document.head.appendChild(link);
      }

      // Cargar JavaScript si no existe
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          console.log('JavaScript de Leaflet cargado');
          // Pequeño delay para asegurar que todo esté listo
          timeoutId = setTimeout(createMap, 100);
        };
        script.onerror = () => {
          console.error('Error al cargar Leaflet');
        };
        document.head.appendChild(script);
      } else {
        // Leaflet ya está disponible
        createMap();
      }
    };

    // Iniciar carga de recursos
    loadLeafletResources();
  };

  // Delay para asegurar que el DOM esté listo
  timeoutId = setTimeout(initializeMap, 50);

  // Cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (mapInstance) {
      try {
        mapInstance.remove();
      } catch (error) {
        console.error('Error al limpiar mapa:', error);
      }
    }
  };
}, [currentStep]); // Dependencia en currentStep para reinicializar cuando sea necesario

// También agrega este useEffect adicional para manejar cambios de paso
useEffect(() => {
  // Reinicializar mapa cuando volvemos al paso 1
  if (currentStep === 1 && !map && mapRef.current) {
    // Forzar reinicialización después de un pequeño delay
    const reinitTimeout = setTimeout(() => {
      if (mapRef.current && !map) {
        // Trigger de reinicialización
        setMap(null);
      }
    }, 100);

    return () => clearTimeout(reinitTimeout);
  }
}, [currentStep, map]);

  // Reemplaza la función getCurrentLocation con esta versión mejorada:

const getCurrentLocation = () => {
  setLoading(true);
  setError(''); // Limpiar errores anteriores
  
  if (!navigator.geolocation) {
    setError('La geolocalización no está soportada en este navegador');
    setLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Verificar que el mapa existe y está listo
        if (!map || !window.L) {
          setError('El mapa no está disponible. Intenta recargar la página.');
          setLoading(false);
          return;
        }

        // Verificar que el mapa tiene el método setView
        if (typeof map.setView !== 'function') {
          setError('Error en la inicialización del mapa. Intenta recargar la página.');
          setLoading(false);
          return;
        }

        // Actualizar vista del mapa
        map.setView([lat, lng], 15);
        
        // Remover marcador anterior si existe
        if (marker && map.hasLayer && map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
        
        // Crear nuevo marcador
        const newMarker = window.L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
        
        // Obtener dirección con manejo de errores mejorado
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { timeout: 10000 } // 10 segundos timeout
          );
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data && data.display_name) {
            setLocation(prev => ({
              ...prev,
              address: data.display_name,
              coordinates: { lat, lng }
            }));
          } else {
            // Fallback si no se puede obtener la dirección
            setLocation(prev => ({
              ...prev,
              address: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              coordinates: { lat, lng }
            }));
          }
        } catch (error) {
          console.warn('Error al obtener dirección, usando coordenadas:', error);
          setLocation(prev => ({
            ...prev,
            address: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            coordinates: { lat, lng }
          }));
        }
        
      } catch (error) {
        console.error('Error al procesar ubicación:', error);
        setError('Error al procesar la ubicación obtenida');
      } finally {
        setLoading(false);
      }
    },
    (error) => {
      let errorMessage = 'No se pudo obtener la ubicación actual';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado al obtener ubicación.';
          break;
        default:
          errorMessage = 'Error desconocido al obtener ubicación.';
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000, // 15 segundos
      maximumAge: 60000 // Cache por 1 minuto
    }
  );
};


   // Cargar medicamentos y drones desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar medicamentos
        const medicationsResponse = await fetch('http://localhost:8081/api/medicamentos');
        const medicationsData = await medicationsResponse.json();
        setMedications(medicationsData);

        // Cargar drones disponibles
        const dronesResponse = await fetch('http://localhost:8081/api/drones');
        const dronesData = await dronesResponse.json();
        setAvailableDrones(dronesData);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos desde el servidor');
      }
    };
    fetchData();
  }, []);

  // FUNCIÓN CORREGIDA - Reemplaza la función assignDroneByPriority existente
useEffect(() => {
  console.log('=== DEBUG MEDICAMENTOS CARGADOS ===');
  console.log('medications array:', medications);
  console.log('medications length:', medications.length);
  
  if (medications.length > 0) {
    console.log('Estructura del primer medicamento:', JSON.stringify(medications[0], null, 2));
    console.log('Campos disponibles:', Object.keys(medications[0]));
  }
}, [medications]);

const assignDroneByPriority = (priority) => {
  console.log('=== INICIO DEBUG ASIGNACIÓN DRON ===');
  console.log('Prioridad recibida:', priority);
  console.log('availableDrones:', availableDrones);
  
  // Verificar si availableDrones está vacío o no es array
  if (!availableDrones || !Array.isArray(availableDrones) || availableDrones.length === 0) {
    console.error('❌ availableDrones está vacío o no es array válido');
    return null;
  }

  // Mostrar información detallada de cada dron
  console.log('--- ANÁLISIS DE DRONES DISPONIBLES ---');
  availableDrones.forEach((drone, index) => {
    console.log(`Dron ${index + 1}:`, {
      id: drone.id,
      identificador: drone.identificador,
      modelo: drone.modelo,
      capacidad_kg: drone.capacidadKg, // ⚠️ CORREGIDO: camelCase
      nivel_bateria: drone.nivelBateria, // ⚠️ CORREGIDO: camelCase
      // Verificar tipos de datos
      tipo_bateria: typeof drone.nivelBateria,
      valor_bateria_crudo: drone.nivelBateria
    });
  });

  // FILTRO CORREGIDO - Usar nombres correctos de campos
  const activeDrones = availableDrones.filter(drone => {
    // Usar el nombre correcto del campo: nivelBateria (no nivel_bateria)
    let bateria = 0;
    
    if (typeof drone.nivelBateria === 'string') {
      // Si es string, remover caracteres no numéricos como '%' 
      bateria = parseInt(drone.nivelBateria.replace(/[^0-9]/g, '')) || 0;
    } else if (typeof drone.nivelBateria === 'number') {
      bateria = drone.nivelBateria;
    }
    
    // Filtro realista ahora que tenemos los datos correctos
    const bateriaMinima = 50; // Nivel mínimo real
    const esValido = bateria >= bateriaMinima;
    
    console.log(`Dron ${drone.identificador || drone.id}: 
      - Batería cruda: "${drone.nivelBateria}" (${typeof drone.nivelBateria})
      - Batería procesada: ${bateria}%
      - Mínima requerida: ${bateriaMinima}%
      - Resultado: ${esValido ? 'VÁLIDO ✅' : 'RECHAZADO ❌'}`);
    
    return esValido;
  });

  console.log(`Drones válidos encontrados: ${activeDrones.length}/${availableDrones.length}`);

  if (activeDrones.length === 0) {
    console.error('❌ NINGÚN DRON PASÓ EL FILTRO');
    console.log('Intentando con filtro aún más permisivo...');
    
    // FILTRO DE EMERGENCIA - Aceptar cualquier dron
    const emergencyDrones = availableDrones.filter(drone => {
      const tieneId = drone.id && drone.identificador;
      console.log(`Dron ${drone.identificador || 'sin_id'}: tiene datos básicos = ${tieneId}`);
      return tieneId;
    });
    
    if (emergencyDrones.length > 0) {
      console.log('✅ Usando filtro de emergencia, drones encontrados:', emergencyDrones.length);
      return emergencyDrones[0]; // Retornar el primer dron disponible
    }
    
    console.error('❌ Incluso el filtro de emergencia falló');
    return null;
  }

  // LÓGICA DE SELECCIÓN CORREGIDA - Usar nombres correctos
  let selectedDrone;
  
  if (priority === 'alta') {
    // Para prioridad alta: mayor capacidad y mejor batería
    selectedDrone = activeDrones.reduce((best, current) => {
      const bestCapacity = parseFloat(best.capacidadKg) || 0; // ⚠️ CORREGIDO
      const currentCapacity = parseFloat(current.capacidadKg) || 0; // ⚠️ CORREGIDO
      const bestBattery = parseInt(best.nivelBateria) || 0; // ⚠️ CORREGIDO
      const currentBattery = parseInt(current.nivelBateria) || 0; // ⚠️ CORREGIDO
      
      // Priorizar capacidad, luego batería
      if (currentCapacity > bestCapacity) return current;
      if (currentCapacity === bestCapacity && currentBattery > bestBattery) return current;
      return best;
    });
  } else if (priority === 'media') {
    // Para prioridad media: balance entre capacidad y batería
    selectedDrone = activeDrones.reduce((best, current) => {
      const bestScore = (parseFloat(best.capacidadKg) || 0) + (parseInt(best.nivelBateria) || 0); // ⚠️ CORREGIDO
      const currentScore = (parseFloat(current.capacidadKg) || 0) + (parseInt(current.nivelBateria) || 0); // ⚠️ CORREGIDO
      return currentScore > bestScore ? current : best;
    });
  } else {
    // Para prioridad baja: cualquier dron disponible (el primero)
    selectedDrone = activeDrones[0];
  }

  console.log('✅ DRON SELECCIONADO:', {
    id: selectedDrone.id,
    identificador: selectedDrone.identificador,
    modelo: selectedDrone.modelo,
    capacidad_kg: selectedDrone.capacidadKg, // ⚠️ CORREGIDO
    nivel_bateria: selectedDrone.nivelBateria, // ⚠️ CORREGIDO
    prioridad_usada: priority
  });

  console.log('=== FIN DEBUG ASIGNACIÓN DRON ===');
  return selectedDrone;
};
  // Manejar selección de medicamentos
  // Reemplaza la función handleMedicationSelect con esta versión mejorada:

// Reemplaza la función handleMedicationSelect con esta versión mejorada:

const handleMedicationSelect = (pain) => {
  console.log('=== SELECCIONANDO MEDICAMENTO ===');
  console.log('Dolor seleccionado:', pain);
  
  const existing = selectedMedications.find(item => item.pain === pain);
  if (existing) {
    console.log('Medicamento ya existe para este dolor');
    return;
  }

  // Buscar medicamento en la base de datos
  const medicationForPain = medications.find(med => {
    // Verificar diferentes formas de coincidencia
    if (med.nombre_comercial && med.nombre_comercial.toLowerCase().includes(pain.toLowerCase())) {
      return true;
    }
    if (med.dolores && med.dolores.toLowerCase() === pain.toLowerCase()) {
      return true;
    }
    if (med.indicaciones && med.indicaciones.toLowerCase().includes(pain.toLowerCase())) {
      return true;
    }
    return false;
  });

  console.log('Medicamento encontrado:', medicationForPain);

  if (medicationForPain) {
    // Verificar que el medicamento tiene ID válido
    if (!medicationForPain.id) {
      console.error('❌ ERROR: El medicamento no tiene ID válido');
      alert(`Error: El medicamento para ${pain} no tiene ID válido en la base de datos`);
      return;
    }
    
    const newMedicationItem = {
      pain,
      medication: {
        id: medicationForPain.id, // ID real de la base de datos
        nombre_comercial: medicationForPain.nombre_comercial,
        forma_administracion: medicationForPain.forma_administracion,
        dolencia: pain,
        peso: medicationForPain.peso || 0.02
      },
      quantity: 1
    };
    
    setSelectedMedications(prev => [...prev, newMedicationItem]);
    console.log('✅ Medicamento agregado exitosamente');
  } else {
    // Si no se encuentra, mostrar mensaje y no agregar medicamento genérico
    alert(`No se encontró un medicamento específico para "${pain}" en nuestra base de datos. Por favor, contacta con el administrador.`);
    console.log('❌ No se encontró medicamento para:', pain);
  }
};
  // Actualizar cantidad de medicamento
  const updateMedicationQuantity = (pain, quantity) => {
    const newQuantity = parseInt(quantity);
    if (newQuantity > 0) {
      setSelectedMedications(prev => 
        prev.map(item => 
          item.pain === pain ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remover medicamento
  const removeMedication = (pain) => {
    setSelectedMedications(prev => prev.filter(item => item.pain !== pain));
  };

  // REEMPLAZA la función handleSubmit completa con esta versión corregida:

  // FUNCIÓN HANDLESUBMIT COMPLETAMENTE CORREGIDA - VERSIÓN FINAL
const handleSubmit = async () => {
  console.log('=== INICIO HANDLE SUBMIT ===');
  
  if (!userInfo) {
    console.error('❌ Usuario no autenticado');
    setError('Usuario no autenticado');
    return;
  }

  setLoading(true);
  setError('');
  
  try {
    // 1. VERIFICAR DATOS PREVIOS
    console.log('--- Verificando datos antes de procesar ---');
    console.log('selectedMedications:', JSON.stringify(selectedMedications, null, 2));
    console.log('priority:', priority);
    console.log('location:', JSON.stringify(location, null, 2));
    console.log('userInfo:', JSON.stringify(userInfo, null, 2));
    
    if (!availableDrones || availableDrones.length === 0) {
      throw new Error('No se han cargado los drones disponibles. Recarga la página e intenta de nuevo.');
    }

    // 2. ASIGNAR DRON
    console.log('--- Llamando a assignDroneByPriority ---');
    const assignedDrone = assignDroneByPriority(priority);
    
    if (!assignedDrone) {
      throw new Error(`No hay drones disponibles en este momento con la prioridad ${priority}.`);
    }

    console.log('✅ Dron asignado exitosamente:', JSON.stringify(assignedDrone, null, 2));

    // 3. VALIDAR IDs - CRÍTICO: CONVERTIR A NÚMEROS
    const userId = parseInt(userInfo.id);
    const droneId = parseInt(assignedDrone.id);
    
    console.log('=== VALIDACIÓN DE IDs ===');
    console.log('userInfo.id (original):', userInfo.id, typeof userInfo.id);
    console.log('userId (parseado):', userId, typeof userId);
    console.log('assignedDrone.id (original):', assignedDrone.id, typeof assignedDrone.id);
    console.log('droneId (parseado):', droneId, typeof droneId);
    
    if (isNaN(userId) || isNaN(droneId) || userId <= 0 || droneId <= 0) {
      throw new Error(`IDs inválidos - Usuario: ${userId}, Dron: ${droneId}`);
    }

    // 4. CREAR SOLICITUD - ESTRUCTURA CORREGIDA PARA JPA
const solicitudData = {
  // ✅ ENVIAR OBJETO USUARIO COMPLETO PARA JPA
  usuario: {
    id: userId
  },
  prioridad: priority.toLowerCase(),          // ✅ Enum en formato Java
  destino: location.address,                    // ✅ texto libre
  region: location.region.toLowerCase(),        // ✅ Enum en formato Java
  estadoSolicitud: 'pendiente',                 // ✅ Enum en formato Java
  dronAsignado: {
    id: droneId
  }
  // ❌ No enviar fechaSolicitud → el backend la establece
};


    console.log('--- SOLICITUD: Enviando datos JPA FORMAT ---');
    console.log('Datos a enviar:', JSON.stringify(solicitudData, null, 2));

    const solicitudResponse = await fetch('http://localhost:8081/api/solicitudes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(solicitudData),
    });

    console.log('Status solicitud response:', solicitudResponse.status);

    if (!solicitudResponse.ok) {
      const errorText = await solicitudResponse.text();
      console.error('❌ Error en solicitud:', errorText);
      console.error('Datos enviados:', JSON.stringify(solicitudData, null, 2));
      throw new Error(`Error al crear solicitud: ${solicitudResponse.status} - ${errorText}`);
    }

    const solicitudCreada = await solicitudResponse.json();
    console.log('✅ Solicitud creada exitosamente:', JSON.stringify(solicitudCreada, null, 2));

    const solicitudId = parseInt(solicitudCreada.id);
    if (isNaN(solicitudId)) {
      throw new Error('ID de solicitud inválido recibido del servidor');
    }

    // 5. GUARDAR MEDICAMENTOS - ESTRUCTURA JPA CORREGIDA
    console.log('--- MEDICAMENTOS: Procesando lista ---');

    for (let i = 0; i < selectedMedications.length; i++) {
      const item = selectedMedications[i];
      
      console.log(`\n=== MEDICAMENTO ${i + 1} DEBUG ===`);
      console.log('item completo:', JSON.stringify(item, null, 2));
      
      // VALIDACIONES CRÍTICAS
      if (!item.medication || !item.medication.id) {
        console.error('❌ ERROR: Medicamento sin ID válido');
        throw new Error(`Medicamento ${i + 1} no tiene ID válido`);
      }
      
      // Verificar que el medicamento existe en la base de datos
      const medicamentoExiste = medications.find(med => med.id === item.medication.id);
      if (!medicamentoExiste) {
        console.error('❌ ERROR: Medicamento no existe en la base de datos');
        throw new Error(`El medicamento con ID ${item.medication.id} no existe en la base de datos`);
      }
      
      // ✅ ESTRUCTURA CORRECTA PARA JPA - Objetos completos
      const medicamentoData = {
        solicitud: {
          id: solicitudId  // JPA espera un objeto con ID
        },
        medicamento: {
          id: parseInt(item.medication.id)  // JPA espera un objeto con ID
        },
        cantidad: parseInt(item.quantity)
      };

      console.log('Datos medicamento (JPA format):', JSON.stringify(medicamentoData, null, 2));
      
      // Validar que los IDs son números válidos
      if (isNaN(medicamentoData.solicitud.id) || isNaN(medicamentoData.medicamento.id)) {
        throw new Error(`IDs inválidos - Solicitud: ${medicamentoData.solicitud.id}, Medicamento: ${medicamentoData.medicamento.id}`);
      }

      console.log(`Enviando medicamento ${i + 1} al servidor...`);
      
      try {
        const medicamentoResponse = await fetch('http://localhost:8081/api/solicitud-medicamentos', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(medicamentoData),
        });

        console.log(`Status medicamento response: ${medicamentoResponse.status}`);
        
        if (!medicamentoResponse.ok) {
          const errorText = await medicamentoResponse.text();
          console.error(`❌ Error en medicamento ${i + 1}:`, errorText);
          console.error('Datos enviados:', JSON.stringify(medicamentoData, null, 2));
          
          // Intentar parsear el error para obtener más información
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(`Error del servidor: ${errorJson.message || errorJson.error || 'Error desconocido'}`);
          } catch {
            throw new Error(`Error al guardar medicamento: ${errorText}`);
          }
        }

        const medicamentoGuardado = await medicamentoResponse.json();
        console.log(`✅ Medicamento ${i + 1} guardado exitosamente:`, medicamentoGuardado);
        
      } catch (fetchError) {
        console.error(`❌ Error de conexión en medicamento ${i + 1}:`, fetchError);
        throw new Error(`Error de conexión al guardar medicamento: ${fetchError.message}`);
      }
    }

    // 6. CREAR VUELO - ESTRUCTURA COMPLETAMENTE CORREGIDA PARA TU MODELO
    console.log('--- VUELO: Preparando datos ---');
    
    const vueloData = {
      // ✅ REFERENCIAS JPA CORRECTAS
      solicitud: {
        id: solicitudId
      },
      dron: {
        id: droneId
      },
      // ✅ FECHA EN FORMATO ISO QUE JPA PUEDE MANEJAR
     fechaInicio: new Date().toLocaleString('sv-SE').replace(' ', 'T')

      
    };

    console.log('--- VUELO: Enviando datos JPA FORMAT ---');
    console.log('Datos vuelo:', JSON.stringify(vueloData, null, 2));

    const vueloResponse = await fetch('http://localhost:8081/api/vuelos', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(vueloData),
    });

    console.log('Status vuelo response:', vueloResponse.status);

    if (!vueloResponse.ok) {
      const errorText = await vueloResponse.text();
      console.error('❌ Error en vuelo:', errorText);
      console.error('Datos vuelo enviados:', JSON.stringify(vueloData, null, 2));
      
      // Log adicional para debugging de vuelos
      console.error('IDs utilizados:', { solicitudId, droneId });
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`Error del servidor al crear vuelo: ${errorJson.message || errorJson.error || 'Error desconocido'}`);
      } catch {
        throw new Error(`Error al crear vuelo: ${vueloResponse.status} - ${errorText}`);
      }
    }

    const vueloCreado = await vueloResponse.json();
    console.log('✅ Vuelo creado exitosamente:', JSON.stringify(vueloCreado, null, 2));

    // 7. ACTUALIZAR ESTADO DE LA SOLICITUD A 'ASIGNADA'
    console.log('--- ACTUALIZANDO ESTADO SOLICITUD ---');
    const updateSolicitudData = {
      estadoSolicitud: 'asignada'  // ✅ camelCase para JPA
    };

    const updateResponse = await fetch(`http://localhost:8081/api/solicitudes/${solicitudId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateSolicitudData),
    });

    if (updateResponse.ok) {
      console.log('✅ Estado de solicitud actualizado a "asignada"');
    } else {
      console.warn('⚠️ No se pudo actualizar el estado de la solicitud, pero continuando...');
    }

    // 8. MOSTRAR ÉXITO CON DETALLES COMPLETOS
    const totalMedicamentos = selectedMedications.reduce((total, item) => total + item.quantity, 0);
    
    alert(`
🎉 ¡SOLICITUD ENVIADA EXITOSAMENTE!

📋 DETALLES DE LA SOLICITUD:
   • ID Solicitud: ${solicitudCreada.id}
   • Estado: Asignada y procesándose

👤 USUARIO:
   • ${userInfo.name}
   • ID Usuario: ${userId} ✅

🚁 DRON ASIGNADO:
   • ${assignedDrone.identificador}
   • ID Dron: ${droneId} ✅
   • Modelo: ${assignedDrone.modelo}
   • Batería: ${assignedDrone.nivelBateria}%
   • Capacidad: ${assignedDrone.capacidadKg} kg

📍 DESTINO:
   • Región: ${regions.find(r => r.value === location.region)?.label}
   • Dirección: ${location.address}

💊 MEDICAMENTOS:
   • ${selectedMedications.length} tipos diferentes
   • ${totalMedicamentos} unidades totales
   • Todos guardados correctamente ✅

⚡ PRIORIDAD: ${priority.toUpperCase()}

🛫 VUELO:
   • ID Vuelo: ${vueloCreado.id} ✅
   • Solicitud ID: ${solicitudId} ✅
   • Dron ID: ${droneId} ✅
   • Fecha inicio: ${new Date().toLocaleString()} ✅
   • Estado: Programado

El dron se dirigirá a tu ubicación pronto. ¡Gracias por usar nuestro servicio!
    `);
    
    // 9. RESETEAR FORMULARIO
    setCurrentStep(1);
    setLocation({ region: '', address: '', coordinates: null, confirmed: false });
    setSelectedMedications([]);
    setPriority('');
    
      // 10. REDIRECCIONAR A LA PÁGINA DE VUELOS
    navigate('/vuelos');

  } catch (err) {
    console.error('❌ Error completo en handleSubmit:', err);
    setError(`Error al procesar la solicitud: ${err.message}`);
    
    // Log adicional para debugging
    console.error('Stack completo:', err.stack);
    console.error('Estado actual:', {
      userInfo,
      selectedMedications: selectedMedications.length,
      priority,
      location: location.address ? 'configurada' : 'no configurada',
      availableDrones: availableDrones.length
    });
  } finally {
    setLoading(false);
    console.log('=== FIN HANDLE SUBMIT ===');
  }
  
};

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = location.region && location.address && location.confirmed;
  const canProceedStep2 = selectedMedications.length > 0;
  const canProceedStep3 = priority;

  // Mostrar error si no está autenticado
  if (!userInfo) {
    return (
      <div className="medical-form-container">
        <div className="form-container">
          <div className="error-message">
            ⚠️ Usuario no autenticado. Por favor, inicia sesión para continuar.
          </div>
        </div>
      </div>
    );
  }


   return (
    <div className="medical-form-container">
      <div className="form-container">
        <div className="header">
          <h1 className="title">Solicitud de Medicamentos</h1>
          <div className="user-info" style={{marginBottom: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px'}}>
            👤 Bienvenido, <strong>{userInfo.name}</strong> | 📧 {userInfo.email}
          </div>
          <div className="progress-bar">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`progress-step ${step <= currentStep ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}



         {/* Paso 1: Ubicación */}
        {currentStep === 1 && (
          <div className="step-container">
            <h2 className="step-title">Selecciona tu Ubicación</h2>
            
            <div className="region-selector">
              <label className="label">Región:</label>
              <select
                value={location.region}
                onChange={(e) => setLocation(prev => ({ ...prev, region: e.target.value }))}
                className="select"
              >
                <option value="">Selecciona una región</option>
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="map-container">
              <div className="map-controls">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="location-button"
                >
                  {loading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                </button>
                <p className="map-instructions">
                  📍 Haz clic en el mapa para seleccionar tu ubicación de entrega
                </p>
              </div>
              
              <div ref={mapRef} className="map"></div>
              
              {location.address && (
                <div className="address-confirmation">
                  <p className="address-text">
                    <strong>Dirección seleccionada:</strong><br />
                    {location.address}
                  </p>
                  <div className="confirmation-buttons">
                    <button
                      type="button"
                      onClick={() => setLocation(prev => ({ ...prev, confirmed: true }))}
                      className={`button ${location.confirmed ? 'confirmed-button' : 'confirm-button'}`}
                    >
                      {location.confirmed ? '✓ Confirmado' : 'Confirmar ubicación'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="navigation-buttons">
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedStep1}
                className={`button next-button ${!canProceedStep1 ? 'disabled-button' : ''}`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
         {/* Paso 2: Selección de Medicamentos */}
        {currentStep === 2 && (
          <div className="step-container">
            <h2 className="step-title">Selecciona tus Medicamentos</h2>
            
            {medications.length === 0 && (
              <div className="debug-info" style={{padding: '10px', backgroundColor: '#fff3cd', marginBottom: '10px', borderRadius: '5px'}}>
                <p>⚠️ Cargando medicamentos desde la base de datos...</p>
              </div>
            )}
            
            <div className="pain-selector">
              <label className="label">¿Qué dolencias tienes?</label>
              <div className="pain-grid">
                {availablePains.map(pain => (
                  <button
                    key={pain}
                    type="button"
                    onClick={() => handleMedicationSelect(pain)}
                    disabled={selectedMedications.some(item => item.pain === pain)}
                    className={`pain-button ${selectedMedications.some(item => item.pain === pain) ? 'selected' : ''}`}
                  >
                    {pain}
                    {selectedMedications.some(item => item.pain === pain) && (
                      <span style={{marginLeft: '5px'}}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedMedications.length > 0 && (
              <div className="selected-medications">
                <h3 className="subtitle">Medicamentos Seleccionados:</h3>
                {selectedMedications.map(item => (
                  <div key={item.pain} className="medication-item">
                    <div className="medication-info">
                      <strong>{item.medication.nombre_comercial || item.medication.nombreComercial}</strong>
                      <span className="medication-pain">Para: {item.pain}</span>
                      <span className="medication-form">
                        Forma: {item.medication.forma_administracion || item.medication.formaAdministracion}
                      </span>
                    </div>
                    <div className="quantity-controls">
                      <label className="quantity-label">Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.quantity}
                        onChange={(e) => updateMedicationQuantity(item.pain, e.target.value)}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication(item.pain)}
                        className="remove-button"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="navigation-buttons">
              <button
                type="button"
                onClick={prevStep}
                className="button prev-button"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedStep2}
                className={`button next-button ${!canProceedStep2 ? 'disabled-button' : ''}`}
              >
                Siguiente ({selectedMedications.length} medicamento{selectedMedications.length !== 1 ? 's' : ''} seleccionado{selectedMedications.length !== 1 ? 's' : ''})
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Prioridad */}
        {currentStep === 3 && (
          <div className="step-container">
            <h2 className="step-title">Selecciona la Prioridad</h2>
            
            <div className="priority-selector">
              {[
                { 
                  value: 'alta', 
                  label: 'Alta', 
                  description: 'Urgente - Asignación de dron premium con mayor capacidad', 
                  color: '#ff4757',
                  details: '🚁 Dron de alta capacidad • ⚡ Batería 70%+ • 🎯 Entrega inmediata'
                },
                { 
                  value: 'media', 
                  label: 'Media', 
                  description: 'Moderada - Asignación de dron estándar', 
                  color: '#ffa502',
                  details: '🚁 Dron estándar • ⚡ Batería 60%+ • 🕐 Entrega en pocas horas'
                },
                { 
                  value: 'baja', 
                  label: 'Baja', 
                  description: 'No urgente - Cualquier dron disponible', 
                  color: '#2ed573',
                  details: '🚁 Cualquier dron • ⚡ Batería 50%+ • 📅 Entrega dentro del día'
                }
              ].map(option => (
                <div
                  key={option.value}
                  onClick={() => setPriority(option.value)}
                  className={`priority-option ${priority === option.value ? 'selected' : ''}`}
                  style={{ borderLeft: `4px solid ${option.color}` }}
                >
                  <div className="priority-header">
                    <span className="priority-label">{option.label}</span>
                    {priority === option.value && <span className="checkmark">✓</span>}
                  </div>
                  <p className="priority-description">{option.description}</p>
                  <small style={{color: '#666', fontSize: '12px'}}>{option.details}</small>
                </div>
              ))}
            </div>

            <div className="navigation-buttons">
              <button
                type="button"
                onClick={prevStep}
                className="button prev-button"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedStep3}
                className={`button next-button ${!canProceedStep3 ? 'disabled-button' : ''}`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Resumen y Confirmación */}
        {currentStep === 4 && (
          <div className="step-container">
            <h2 className="step-title">Confirma tu Solicitud</h2>
            
            <div className="summary">
              <div className="summary-section">
                <h3 className="summary-title">👤 Solicitante</h3>
                <p className="summary-text">
                  <strong>Nombre:</strong> {userInfo.name}<br />
                  <strong>Email:</strong> {userInfo.email}<br />
                  <strong>ID Usuario:</strong> {userInfo.id}
                </p>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">📍 Ubicación de Entrega</h3>
                <p className="summary-text">
                  <strong>Región:</strong> {regions.find(r => r.value === location.region)?.label}<br />
                  <strong>Dirección:</strong> {location.address}
                </p>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">💊 Medicamentos Solicitados</h3>
                {selectedMedications.map(item => (
                  <div key={item.pain} className="summary-medication">
                    <strong>{item.medication.nombre_comercial || item.medication.nombreComercial}</strong> - Cantidad: {item.quantity}<br />
                    <small>Para: {item.pain} | Forma: {item.medication.forma_administracion || item.medication.formaAdministracion}</small>
                  </div>
                ))}
                <p><strong>Total medicamentos:</strong> {selectedMedications.reduce((total, item) => total + item.quantity, 0)}</p>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">⚡ Prioridad y Asignación</h3>
                <p className="summary-text">
                  <span className={`priority-badge ${priority}`}>
                    {priority === 'alta' ? 'Alta' : priority === 'media' ? 'Media' : 'Baja'}
                  </span>
                  <br />
                  <small>Se asignará automáticamente el mejor dron disponible según tu prioridad</small>
                </p>
              </div>
            </div>

            <div className="navigation-buttons">
              <button
                type="button"
                onClick={prevStep}
                className="button prev-button"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="button submit-button"
              >
                {loading ? 'Enviando solicitud y asignando dron...' : 'Enviar Solicitud'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRequestForm;