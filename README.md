# ClefChamp

ClefChamp es una aplicación web de aprendizaje musical gamificada inspirada en Duolingo. Permite a usuarios aprender música a través de juegos interactivos y lecciones.

## 🚀 Características principales
- 🎮 Juegos de aprendizaje musical:
  - Identificación de notas en el teclado.
  - Juego de ritmo.
  - Reconocimiento auditivo de notas.
  - Adivinanza de notas musicales con el teclado.
- 🏆 Sistema de puntos e insignias.
- 📈 Visualización de progreso.
- 👥 Roles de usuario: profesores y alumnos.
- 📝 Creación de lecciones personalizadas por los usuarios.

## 🛠️ Tecnologías utilizadas
- **Backend:** Node.js (Express)
- **Frontend:** HTML, CSS, Bootstrap, jQuery
- **Gráficos:** VexTab (pentagramas interactivos)
- **Base de datos:** MariaDB

## 📂 Instalación
### Prerrequisitos
- Node.js (v18.15.0)

### Pasos
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/clefchamp.git
   ```
2. Entra en el directorio:
   ```bash
   cd clefchamp
   ```
6. Accede a la aplicación en `http://clefchamp.es`

## 🚀 Despliegue en Azure
1. Sube los archivos al servidor usando SSH.
2. Asegúrate de que `clefchamp.sql` está cargado en la base de datos.
3. Inicia el proceso con:
   ```bash
   pm2 start index.js --name clefchamp
   ```

## 🧩 Contribuciones
¡Toda contribución es bienvenida! Por favor, abre un issue para reportar errores o sugerir nuevas características.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
