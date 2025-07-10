import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Intranet from './components/Intranet';
import Solicitud from './components/Solicitud';
import Historial from './components/Historial'
import Vuelos from './components/Vuelos';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route path="/intranet" element={<Intranet />} />
          <Route path="/solicitud" element={<Solicitud />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/vuelos" element={<Vuelos />} />


        </Routes>
      </Layout>
    </Router>
  );
}

export default App;