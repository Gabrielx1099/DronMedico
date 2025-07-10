import React, { useEffect } from 'react';
import '../css/Home.css';

// Importar imágenes locales desde src/imagenes/
import imgPuno from '../Imagenes/Puno.jpg';
import imgCusco from '../Imagenes/Cusco.jpg';
import imgAmazonas from '../Imagenes/Amazonas.jpg';
import imgArequipa from '../Imagenes/Arequipa.jpg';

const Inicio = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js';
    script.async = true;
    document.body.appendChild(script);

    // Intersection Observer para animación en scroll
    const sections = document.querySelectorAll('.section');
    
    const options = {
      root: null,
      threshold: 0.5,
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Deja de observar una vez que la sección se ha hecho visible
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    sections.forEach(section => observer.observe(section));

    return () => {
      document.body.removeChild(script);
      observer.disconnect();
    };
  }, []);

  const zonas = [
    {
      nombre: 'Puno',
      descripcion: 'Una región montañosa donde el acceso es limitado.',
      imagen: imgPuno,
    },
    {
      nombre: 'Cusco',
      descripcion: 'Zonas rurales de difícil acceso, especialmente en temporada de lluvias.',
      imagen: imgCusco,
    },
    {
      nombre: 'Amazonas',
      descripcion: 'En la región amazónica, donde el transporte es complejo y lento.',
      imagen: imgAmazonas,
    },
    {
      nombre: 'Arequipa',
      descripcion: 'Las áreas rurales fuera de la ciudad se benefician de este servicio rápido y eficiente.',
      imagen: imgArequipa,
    },
  ];

  return (
    <div className="inicio-container">
      {/* Sección Intro */}
      <section className="section intro">
        <div className="inicio-texto">
          <h1 className="animate-text">Llevamos salud a donde más se necesita</h1>
          <p className="animate-subtext">
            Nuestros drones están diseñados para entregar medicina de forma rápida y segura en zonas rurales de Perú.
          </p>
        </div>
        <div className="inicio-spline">
          <div className="spline-container">
            <spline-viewer
              url="https://prod.spline.design/XTHMBPm3Zj5S8e-1/scene.splinecode"
            ></spline-viewer>
          </div>
        </div>
      </section>

      {/* Sección ¿Quiénes somos? */}
      <section className="section about-us">
        <div className="about-text">
          <h2>¿Quiénes somos?</h2>
          <p>
            Somos una empresa dedicada a ayudar a las personas, especialmente en áreas rurales de Perú, mediante el uso de drones que entregan medicinas y productos de salud. Nuestro objetivo es llegar donde otros no pueden.
          </p>
        </div>
      </section>
      
      {/* Sección Zonas rurales */}
      <section className="section zones">
        <p className="zones-subtitle">Zonas donde pensamos llegar</p>
        <h2>Áreas que cubrimos</h2>
        <p></p>
        <div className="cards-container">
          {zonas.map((zona, index) => (
            <div className="card animated-card" key={index}>
              <img src={zona.imagen} alt={`Zona ${zona.nombre}`} />
              <div className="card-description">
                <h3>Zona: {zona.nombre}</h3>
                <p>{zona.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Inicio;
