require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Transporte de Carga - Backend Activo',
    version: '1.0.0'
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

module.exports = app;