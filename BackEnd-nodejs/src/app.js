require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// Importación de tus módulos
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

// 1. Configuración de CORS optimizada
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permitir cookies/sesiones
  optionsSuccessStatus: 200
};

// --- MIDDLEWARES DE SEGURIDAD Y LOGS ---
app.use(helmet()); // Protege encabezados HTTP
app.use(cors(corsOptions));
app.use(express.json()); // Para recibir JSON en el body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logs de peticiones usando Morgan y tu logger personalizado
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// --- RUTAS ---

// Ruta de prueba (Health Check)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Transporte de Carga - Backend Activo',
    version: '1.0.0'
  });
});

// Todas tus rutas de negocio (viajes, camiones, motoristas)
app.use('/api', routes);

// --- MANEJO DE ERRORES (EL ARREGLO CLAVE) ---
app.use((err, req, res, next) => {
  // Logueamos el error completo para el desarrollador
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = err.status || 500;

  // Enviamos una respuesta estructurada al Frontend
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    // Solo mostrar el stack de error si estamos en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

module.exports = app;