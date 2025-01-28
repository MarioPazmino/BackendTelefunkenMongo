require('dotenv').config(); // Cargar las variables de entorno

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const routerApi = require('./routes');

// Configurar Express
const app = express();
const port = 3000; // Cambia el puerto aquí

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Implementar el sistema de rutas versionadas
routerApi(app);

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
