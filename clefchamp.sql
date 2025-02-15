-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-02-2025 a las 16:43:33
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clefchamp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `icons`
--

CREATE TABLE `icons` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `unlockCondition` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `icons`
--

INSERT INTO `icons` (`id`, `name`, `path`, `unlockCondition`) VALUES
(1, 'Violín', 'violin.svg', 'Se desbloquea al crear la cuenta'),
(2, 'Guitarra', 'guitarra.svg', 'Se desbloquea al crear la cuenta'),
(3, 'Piano', 'piano.svg', 'Se desbloquea al crear la cuenta'),
(4, 'Batería', 'bateria.svg', 'Se desbloquea al crear la cuenta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levelprogression`
--

CREATE TABLE `levelprogression` (
  `level` int(11) NOT NULL,
  `experienceRequiered` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `levelprogression`
--

INSERT INTO `levelprogression` (`level`, `experienceRequiered`) VALUES
(2, 150),
(3, 150),
(4, 150),
(5, 180),
(6, 210),
(7, 240),
(8, 270),
(9, 300),
(10, 330),
(11, 360),
(12, 390),
(13, 420),
(14, 450),
(15, 480),
(16, 510),
(17, 540),
(18, 570),
(19, 600),
(20, 635),
(21, 670),
(22, 710),
(23, 750),
(24, 795),
(25, 840),
(26, 890),
(27, 940),
(28, 990),
(29, 1040),
(30, 1090),
(31, 1145),
(32, 1205),
(33, 1270),
(34, 1340),
(35, 1415),
(36, 1495),
(37, 1580),
(38, 1670),
(39, 1765),
(40, 1865),
(41, 1975),
(42, 2095),
(43, 2225),
(44, 2365),
(45, 2515),
(46, 2675),
(47, 2845),
(48, 3025),
(49, 3215),
(50, 3415);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pruebanivel`
--

CREATE TABLE `pruebanivel` (
  `id` int(11) NOT NULL,
  `times` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `totalTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('wKDGI6S0fvqoMFXNTcjr6ZRca7dUzFb4', 1739720442, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"name\":\"Jesús\",\"tagname\":\"jesuggc\",\"email\":\"jesuggcc@gmail.com\",\"icon\":\"default.png\",\"friendCode\":\"#J35U5J4J4\",\"joindate\":{\"day\":28,\"month\":10,\"year\":2024},\"level\":3,\"experience\":0,\"experienceToNext\":150}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usericons`
--

CREATE TABLE `usericons` (
  `userIconId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `iconId` int(11) NOT NULL,
  `isSelected` tinyint(1) NOT NULL,
  `bgColor` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userlevel`
--

CREATE TABLE `userlevel` (
  `idUser` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `experience` int(11) NOT NULL,
  `experienceToNext` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `userlevel`
--

INSERT INTO `userlevel` (`idUser`, `level`, `experience`, `experienceToNext`) VALUES
(1, 3, 0, 150);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `tagname` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(30) NOT NULL,
  `name` varchar(20) NOT NULL,
  `icon` varchar(30) NOT NULL,
  `joindate` timestamp NOT NULL DEFAULT current_timestamp(),
  `friendCode` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `tagname`, `email`, `password`, `name`, `icon`, `joindate`, `friendCode`) VALUES
(1, 'jesuggc', 'jesuggcc@gmail.com', '1', 'Jesús', 'default.png', '2024-10-28 19:50:26', '#J35U5J4J4'),
(3, 'dayusky', 'oli.mmm.pia@gmail.com', 'Hol4444*', '', 'default.png', '2024-10-28 19:50:26', '#OP9V6INHS'),
(4, '', '', 'm123', 'Marcos', 'default.png', '2024-10-29 00:00:11', '#MZ3OA4BSC'),
(5, 'pepeDomingo', 'pepeDomingo@gmail.com', 'Aa1?aaaa', 'Pepe', 'default.png', '2025-02-11 10:27:19', '#LESXBZAXS'),
(6, 'ffernan01', 'fferna@ucm.es', 'Aa1?aaaa', 'PAco', 'default.png', '2025-02-11 10:29:55', '#8PZU01FEW');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `icons`
--
ALTER TABLE `icons`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pruebanivel`
--
ALTER TABLE `pruebanivel`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usericons`
--
ALTER TABLE `usericons`
  ADD PRIMARY KEY (`userIconId`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `icons`
--
ALTER TABLE `icons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pruebanivel`
--
ALTER TABLE `pruebanivel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usericons`
--
ALTER TABLE `usericons`
  MODIFY `userIconId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
