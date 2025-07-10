import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          contraseña: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar toda la información del usuario en localStorage
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        if (data.rol) {
          localStorage.setItem('rol', data.rol);
        }
        if (data.nombre) {
          localStorage.setItem('nombre', data.nombre);
        }
        if (data.email) {
          localStorage.setItem('email', data.email);
        }

        // Disparar evento para forzar re-render en Layout
        window.dispatchEvent(new Event('storage'));
        
        // Debug - verificar qué se guardó
        console.log('Usuario logueado:', {
          userId: data.userId,
          rol: data.rol,
          nombre: data.nombre,
          email: data.email
        });
        
        // Redirigir según el rol
        if (data.rol === 'admin') {
          navigate('/intranet');
        } else if (data.rol === 'cliente') {
          navigate('/solicitud');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">Iniciar Sesión</button>
        
        <div className="register-link">
          ¿No tienes una cuenta? <Link to="/registrar">Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;