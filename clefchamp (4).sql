-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 14:25:54
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
  `experienceRequired` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `levelprogression`
--

INSERT INTO `levelprogression` (`level`, `experienceRequired`) VALUES
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
('1JgNXxlK3CNkM9gpqFcjJIxaPt33mTou', 1740437112, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":22,\"name\":\"ines\",\"tagname\":\"dayuyi\",\"email\":\"ineprimo@ucm.es\",\"icon\":\"default.png\",\"friendCode\":\"#HFFD13CBJ\",\"joindate\":{\"day\":23,\"month\":2,\"year\":2025},\"level\":1,\"experience\":35,\"experienceToNext\":115,\"preferences\":{\"showTutorial\":false}}}'),
('OXrvt-1OWFsBJpB-wOjF2HkNoWfbOrA5', 1740517890, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"name\":\"Jesús\",\"tagname\":\"jesuggc\",\"email\":\"jesuggcc@gmail.com\",\"icon\":\"default.png\",\"friendCode\":\"#J35U5J4J4\",\"joindate\":{\"day\":28,\"month\":10,\"year\":2024},\"level\":1,\"experience\":44,\"experienceToNext\":106,\"preferences\":{\"showTutorial\":0}}}'),
('SJlbRqEzjYan7Xa3oor6YJN4_3s_yLJv', 1740575804, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"name\":\"Jesús\",\"tagname\":\"jesuggc\",\"email\":\"jesuggcc@gmail.com\",\"icon\":\"default.png\",\"friendCode\":\"#J35U5J4J4\",\"joindate\":{\"day\":28,\"month\":10,\"year\":2024},\"level\":1,\"experience\":64,\"experienceToNext\":86,\"preferences\":{\"showTutorial\":0}}}'),
('hv9BT6gRsMxyavrLmC1PINDj6p6ll403', 1740434421, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":21,\"name\":\"lucia\",\"tagname\":\"lucia\",\"email\":\"luvazro02@gmail.com\",\"icon\":\"default.png\",\"friendCode\":\"#V8DFHKS5E\",\"joindate\":{\"day\":23,\"month\":2,\"year\":2025},\"level\":1,\"experience\":79,\"experienceToNext\":71,\"preferences\":{\"showTutorial\":0}}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usericons`
--

CREATE TABLE `usericons` (
  `userIconId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `iconId` int(11) NOT NULL,
  `isSelected` tinyint(1) NOT NULL,
  `bgColor` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usericons`
--

INSERT INTO `usericons` (`userIconId`, `userId`, `iconId`, `isSelected`, `bgColor`) VALUES
(1, 15, 1, 0, 'transparent'),
(2, 16, 1, 0, 'transparent'),
(3, 16, 2, 0, 'transparent'),
(4, 16, 3, 0, 'transparent'),
(5, 16, 4, 0, 'transparent'),
(6, 17, 1, 0, 'transparent'),
(7, 17, 2, 0, 'transparent'),
(8, 17, 4, 0, 'transparent'),
(9, 17, 3, 0, 'transparent'),
(10, 18, 4, 0, 'transparent'),
(11, 18, 1, 0, 'transparent'),
(12, 18, 2, 0, 'transparent'),
(13, 18, 3, 0, 'transparent'),
(14, 19, 4, 0, 'transparent'),
(15, 19, 1, 0, 'transparent'),
(16, 19, 2, 0, 'transparent'),
(17, 19, 3, 0, 'transparent'),
(18, 20, 1, 0, 'transparent'),
(19, 20, 3, 0, 'transparent'),
(20, 20, 2, 0, 'transparent'),
(21, 20, 4, 0, 'transparent'),
(22, 1, 1, 0, 'transparent'),
(23, 1, 2, 0, 'transparent'),
(24, 1, 3, 0, 'transparent'),
(25, 1, 4, 0, 'transparent'),
(26, 21, 1, 0, 'transparent'),
(27, 21, 2, 0, 'transparent'),
(28, 21, 3, 0, 'transparent'),
(29, 21, 4, 0, 'transparent'),
(30, 22, 1, 0, 'transparent'),
(31, 22, 2, 0, 'transparent'),
(32, 22, 3, 0, 'transparent'),
(33, 22, 4, 0, 'transparent');

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
(1, 1, 64, 86),
(17, 1, 0, 150),
(20, 1, 0, 150),
(21, 1, 79, 71),
(22, 1, 35, 115);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userpreferences`
--

CREATE TABLE `userpreferences` (
  `idUser` int(11) NOT NULL,
  `showTutorial` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `userpreferences`
--

INSERT INTO `userpreferences` (`idUser`, `showTutorial`) VALUES
(1, 0),
(1, 0),
(1, 0),
(21, 0),
(22, 0);

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
(6, 'ffernan01', 'fferna@ucm.es', 'Aa1?aaaa', 'PAco', 'default.png', '2025-02-11 10:29:55', '#8PZU01FEW'),
(7, 'anto', 'anto@ucm.es', 'Aa1?aaaa', 'Antonio', 'default.png', '2025-02-22 10:31:30', '#XUPFEGZUD'),
(8, 'anto', 'anto@ucm.es', 'Aa1?aaaa', 'Antonio', 'default.png', '2025-02-22 10:46:20', '#D6LBNW0I2'),
(9, 'mika', 'elmika@gmail.com', 'aA1?aaaa', 'Mikael', 'default.png', '2025-02-22 11:02:10', '#XDG8Q460N'),
(10, 'mika2', 'elmika2@gmail.com', 'aA1?aaaa', 'Mikael', 'default.png', '2025-02-22 11:03:53', '#DP8WVUIV5'),
(11, 'mika23', 'elmika23@gmail.com', 'aA1?aaaa', 'Mikael', 'default.png', '2025-02-22 11:04:54', '#YM98XN4F0'),
(12, 'ma', 'ma@ma.com', 'aA1?aaaa', 'Marcos', 'default.png', '2025-02-22 11:06:20', '#DWDQ3DI3P'),
(13, 'aaa', 'aa@a.aa', 'Aa1?aaaa', 'aaa', 'default.png', '2025-02-22 11:09:31', '#WM2FVRIWZ'),
(14, 'aa', 'aa@aaaa.aa', 'aA1?aaaa', 'AAa', 'default.png', '2025-02-22 11:16:45', '#Z95W2VC2M'),
(15, 'aa', 'aa@aaaa.aaa', 'aA1?aaaa', 'AAa', 'default.png', '2025-02-22 11:18:42', '#SDT5ZJAD6'),
(16, 'aa', 'aa@aaaa.aaaA', 'aA1?aaaa', 'AAa', 'default.png', '2025-02-22 11:23:24', '#OXO562EXW'),
(17, 'jesuggc2', 'jesuggc@gmail.com', 'aA1?1111', 'Jesus', 'default.png', '2025-02-23 10:21:37', '#IH7B5SMQ9'),
(18, 'pep', 'pep@pp.pep', 'a1?Aaaaa', 'pep', 'default.png', '2025-02-23 10:23:51', '#KDSXX7DXA'),
(19, 'asd', 'asd@as.aas', 'a1?Aaaaa', 'asd', 'default.png', '2025-02-23 10:25:15', '#DLL8435V2'),
(20, 'asda', 'asd@asd.as', 'aA1?aaaa', 'asd', 'default.png', '2025-02-23 10:27:19', '#CDP9912RL'),
(21, 'lucia', 'luvazro02@gmail.com', 'Lucia_100802', 'lucia', 'default.png', '2025-02-23 21:19:39', '#V8DFHKS5E'),
(22, 'dayuyi', 'ineprimo@ucm.es', 'Jhin4444.', 'ines', 'default.png', '2025-02-23 22:36:41', '#HFFD13CBJ');

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
  MODIFY `userIconId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
