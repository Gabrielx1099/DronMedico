-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-07-2025 a las 09:21:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dronmedico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `drones`
--

CREATE TABLE `drones` (
  `id` int(11) NOT NULL,
  `identificador` varchar(255) DEFAULT NULL,
  `modelo` varchar(255) DEFAULT NULL,
  `capacidad_kg` decimal(5,2) DEFAULT NULL,
  `nivel_bateria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `drones`
--

INSERT INTO `drones` (`id`, `identificador`, `modelo`, `capacidad_kg`, `nivel_bateria`) VALUES
(1, 'Dron A1', 'DJI Matrice 300 RTK', 2.00, 95),
(2, 'Dron B2', 'Wingcopter 198', 1.50, 88),
(3, 'Dron C3', 'Zipline Zips 3.0', 3.00, 70),
(4, 'Dron D4', 'Skyports Medical X1', 1.20, 20),
(5, 'Dron E5', 'Flyox I Aero-Health', 5.00, 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `dolores` varchar(100) NOT NULL,
  `forma_administracion` enum('Pastilla','Inyección','Jarabe','Pomada','Gotas','Otros') NOT NULL,
  `nombre_comercial` varchar(100) NOT NULL,
  `descripcion_uso` text DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`id`, `dolores`, `forma_administracion`, `nombre_comercial`, `descripcion_uso`, `peso`) VALUES
(1, 'Dolor de cabeza', 'Pastilla', 'Panadol', 'Tomar 1 tableta cada 8 horas después de comer. No exceder 3 al día.', 0.02),
(2, 'Fiebre', 'Inyección', 'Dipirona', 'Aplicar 1 ampolla intramuscular cada 12 horas. Bajo receta médica.', 0.05),
(3, 'Dolor estomacal', 'Jarabe', 'Buscapina Compositum', 'Tomar 10 ml cada 6 horas. Agitar antes de usar.', 0.15),
(4, 'Resfrío común', 'Pastilla', 'Antigripal Forte', 'Tomar 1 cápsula cada 8 horas. No operar maquinaria.', 0.02),
(5, 'Presión alta', 'Pastilla', 'Losartán', 'Tomar 1 tableta diaria en la mañana. No interrumpir el tratamiento.', 0.02),
(6, 'Diabetes', 'Inyección', 'Insulina NPH', 'Inyectar 1 dosis subcutánea antes del desayuno. Refrigerar.', 0.05),
(7, 'Dolor muscular', 'Pomada', 'Voltaren Emulgel', 'Aplicar 3 veces al día sobre el área afectada.', 0.10),
(8, 'Alergias', 'Gotas', 'Loratadina Gotas', 'Aplicar 10 gotas orales una vez al día.', 0.01),
(9, 'Infección urinaria', 'Pastilla', 'Amoxicilina 500mg', 'Tomar 1 cápsula cada 8 horas durante 7 días.', 0.02),
(10, 'Dolor de garganta', 'Jarabe', 'Benadryl Jarabe', 'Tomar 10 ml cada 6-8 horas. Evitar alcohol.', 0.15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_solicitud` timestamp NULL DEFAULT current_timestamp(),
  `prioridad` enum('alta','media','baja') DEFAULT NULL,
  `destino` text DEFAULT NULL,
  `region` enum('puno','cusco','amazonas','arequipa') NOT NULL,
  `estado_solicitud` enum('pendiente','asignada','en_proceso','entregada','cancelada','confirmado') DEFAULT NULL,
  `dron_asignado_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `id_usuario`, `fecha_solicitud`, `prioridad`, `destino`, `region`, `estado_solicitud`, `dron_asignado_id`) VALUES
(33, 5, '2025-07-09 03:34:55', 'alta', 'Omate, General Sánchez Cerro, Moquegua, Perú', 'amazonas', 'confirmado', 3),
(34, 5, '2025-07-09 03:39:07', 'alta', 'Vincho, Salamanca, Condesuyos, Arequipa, Perú', 'arequipa', 'confirmado', 3),
(35, 5, '2025-07-09 14:42:55', 'alta', 'Avenida Arequipa, Santa Beatriz, Lima, Lima Metropolitana, Lima, 15083, Perú', 'amazonas', 'confirmado', 3),
(36, 5, '2025-07-15 23:17:34', 'alta', 'Calle Puno, Puente Piedra, Lima, Lima Metropolitana, Lima, 15118, Perú', 'cusco', 'confirmado', 3),
(37, 5, '2025-07-15 23:24:31', 'alta', 'Lagunas, Sayapullo, Gran Chimú, La Libertad, Perú', 'amazonas', 'confirmado', 3),
(38, 7, '2025-07-16 04:34:25', 'alta', 'Mollebamba, Paccaritambo, Paruro, Cusco, Perú', 'cusco', 'confirmado', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_medicamentos`
--

CREATE TABLE `solicitud_medicamentos` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `medicamento_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_medicamentos`
--

INSERT INTO `solicitud_medicamentos` (`id`, `solicitud_id`, `medicamento_id`, `cantidad`) VALUES
(74, 33, 5, 1),
(75, 33, 2, 1),
(76, 33, 6, 1),
(77, 34, 10, 1),
(78, 34, 2, 1),
(79, 34, 3, 1),
(80, 35, 1, 1),
(81, 36, 2, 1),
(82, 36, 3, 1),
(83, 37, 2, 1),
(84, 37, 4, 1),
(85, 38, 1, 1),
(86, 38, 2, 2),
(87, 38, 5, 1),
(88, 38, 6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `dni` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `fechacreacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `dni`, `email`, `telefono`, `direccion`, `contraseña`, `rol`, `fechacreacion`) VALUES
(5, 'Yeiden', 'Gonzales', '72256354', '1@gmail.com', '987467374', 'aaa', '$2a$10$P9MZ6eNvZut6F14JlJ/LhOGMC75HFua1MUZcOfayPWTzRd3tWQjJ6', 'cliente', '2025-07-07 19:58:37'),
(6, 'Cristian', 'Vicente', '72339278', 'gv250204@gmail.com', '963285644', 'Arequipa #123', '$2a$10$JmtlzIuRWeeTuLg9PTOl8.D6NAQMoIoKhuP/1bUwf/8CWsS8OjUUe', 'cliente', '2025-07-15 23:54:46'),
(7, 'Gabriel', 'Omar', '72449583', 'Yeiden123@gmail.com', '987467371', 'Arequipa #123', '$2a$10$GM3hPSlI8efUPjJ/5/2JRuglV2PO8dlivRT/mXrF1KsNjWr/oZu4W', 'cliente', '2025-07-16 04:33:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

CREATE TABLE `vuelos` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) DEFAULT NULL,
  `dron_id` int(11) DEFAULT NULL,
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT NULL,
  `distancia_km` decimal(5,2) DEFAULT NULL,
  `estado_entrega` enum('exitoso','fallido','desviado','incompleto') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vuelos`
--

INSERT INTO `vuelos` (`id`, `solicitud_id`, `dron_id`, `fecha_inicio`, `fecha_fin`, `duracion_minutos`, `distancia_km`, `estado_entrega`) VALUES
(19, 33, 3, '2025-07-09 03:34:56', '2025-07-09 03:37:06', 2, 2.21, 'exitoso'),
(20, 34, 3, '2025-07-09 03:39:07', '2025-07-09 03:41:56', 2, 3.00, 'exitoso'),
(21, 35, 3, '2025-07-09 14:42:55', '2025-07-09 14:45:53', 2, 5.00, 'exitoso'),
(22, 36, 3, '2025-07-15 23:17:34', '2025-07-15 23:21:45', 4, 4.19, 'exitoso'),
(23, 37, 3, '2025-07-15 23:24:32', '2025-07-15 23:40:45', 16, 4.00, 'exitoso'),
(24, 38, 3, '2025-07-16 04:34:25', '2025-07-16 04:37:34', 3, 3.00, 'exitoso');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `drones`
--
ALTER TABLE `drones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `dron_asignado_id` (`dron_asignado_id`);

--
-- Indices de la tabla `solicitud_medicamentos`
--
ALTER TABLE `solicitud_medicamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`),
  ADD KEY `medicamento_id` (`medicamento_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`),
  ADD KEY `dron_id` (`dron_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `drones`
--
ALTER TABLE `drones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `solicitud_medicamentos`
--
ALTER TABLE `solicitud_medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`dron_asignado_id`) REFERENCES `drones` (`id`);

--
-- Filtros para la tabla `solicitud_medicamentos`
--
ALTER TABLE `solicitud_medicamentos`
  ADD CONSTRAINT `solicitud_medicamentos_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes` (`id`),
  ADD CONSTRAINT `solicitud_medicamentos_ibfk_2` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos` (`id`);

--
-- Filtros para la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD CONSTRAINT `vuelos_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes` (`id`),
  ADD CONSTRAINT `vuelos_ibfk_2` FOREIGN KEY (`dron_id`) REFERENCES `drones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
