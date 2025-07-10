import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Layout.css';

const Layout = ({ children }) => {
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!rol;

  useEffect(() => {
    const onStorage = () => {
      setNombre(localStorage.getItem('nombre'));
      setRol(localStorage.getItem('rol'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Función para manejar clics en enlaces protegidos
  const handleProtectedLinkClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login');
    } else {
      setMenuAbierto(false);
    }
  };

  // Función para enlaces no protegidos
  const handlePublicLinkClick = () => {
    setMenuAbierto(false);
  };

  return (
    <div className="layout">
      <nav className="navbar-custom">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span role="img" aria-label="logo">🚁</span>Dron<span className="brand-highlight">Medico</span>
          </Link>

          <button className="hamburger" onClick={toggleMenu}>
            {menuAbierto ? '✖️' : '☰'}
          </button>
        </div>

        <div className={`nav-links-custom ${menuAbierto ? 'show' : ''}`}>
          <Link to="/" onClick={handlePublicLinkClick}>Inicio</Link>
          
          <Link 
            to="/solicitud" 
            onClick={(e) => handleProtectedLinkClick(e, '/solicitud')}
          >
            Solicitud de envio
          </Link>
          
          <Link 
            to="/alertas" 
            onClick={(e) => handleProtectedLinkClick(e, '/alertas')}
          >
            Alertas
          </Link>
          
          <Link 
            to="/historial" 
            onClick={(e) => handleProtectedLinkClick(e, '/historial')}
          >
            Historial
          </Link>
          
          <Link 
            to="/vuelos" 
            onClick={(e) => handleProtectedLinkClick(e, '/vuelos')}
          >
            Vuelos
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/login" className="nav-btn login-btn" onClick={handlePublicLinkClick}>
                <span role="img" aria-label="login">🔑</span> Iniciar sesión
              </Link>
              <Link to="/registrar" className="nav-btn register-btn" onClick={handlePublicLinkClick}>
                <span role="img" aria-label="register">👤</span> Registrarse
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <span className="nav-btn user-info">
                <span role="img" aria-label="user">👤</span> {nombre || 'Usuario'}
              </span>
              <button className="nav-btn logout-btn" onClick={() => { handleLogout(); setMenuAbierto(false); }}>
                <span role="img" aria-label="logout">🚪</span> Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer-custom">
        <div className="footer-content">
          {/* Sección 1: Información de la empresa */}
          <div className="footer-section">
            <div className="footer-brand">
              <span role="img" aria-label="drone">🚁</span>
              <span className="brand-highlight">DronMedico</span>
            </div>
            <p className="footer-description">
              Sistema avanzado de drones médicos para entregas rápidas y seguras de medicamentos y suministros médicos.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com" className="social-link facebook" target="_blank" rel="noopener noreferrer">
                📘
              </a>
              <a href="https://www.instagram.com" className="social-link instagram" target="_blank" rel="noopener noreferrer">
                📷
              </a>
              <a href="https://wa.me/51935532263" className="social-link whatsapp" target="_blank" rel="noopener noreferrer">
                📱
              </a>
              <a href="https://www.twitter.com" className="social-link twitter" target="_blank" rel="noopener noreferrer">
                🐦
              </a>
            </div>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={handlePublicLinkClick}>🏠 Inicio</Link></li>
              <li>
                <Link 
                  to="/registro-envios" 
                  onClick={(e) => handleProtectedLinkClick(e, '/registro-envios')}
                >
                  📦 Registro de Envíos
                </Link>
              </li>
              <li>
                <Link 
                  to="/drones" 
                  onClick={(e) => handleProtectedLinkClick(e, '/drones')}
                >
                  🚁 Gestión de Drones
                </Link>
              </li>
              <li>
                <Link 
                  to="/alertas" 
                  onClick={(e) => handleProtectedLinkClick(e, '/alertas')}
                >
                  🚨 Centro de Alertas
                </Link>
              </li>
              <li>
                <Link 
                  to="/historial" 
                  onClick={(e) => handleProtectedLinkClick(e, '/historial')}
                >
                  📊 Historial Médico
                </Link>
              </li>
              <li>
                <Link 
                  to="/usuario" 
                  onClick={(e) => handleProtectedLinkClick(e, '/usuario')}
                >
                  👤 Perfil de Usuario
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección 3: Contacto e información */}
          <div className="footer-section">
            <h4>Contacto & Soporte</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                <span>Av. Medicina 123, San Isidro<br/>Lima, Perú</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>+51 935 532 264</span>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <span>contacto@dronmedico.com</span>
              </li>
              <li>
                <span className="contact-icon">🕒</span>
                <span>Atención 24/7</span>
              </li>
            </ul>
            <div className="emergency-contact">
              <h5>🆘 Emergencias Médicas</h5>
              <p className="emergency-number">📞 +51 900 000 000</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 DronMedico. Todos los derechos reservados. | Salvando vidas con tecnología avanzada</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;