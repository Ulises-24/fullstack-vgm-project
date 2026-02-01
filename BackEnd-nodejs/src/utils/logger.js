const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { NODE_ENV } = require('../config/environment');

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug', // Es mas verboso en desarrollo/development
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    // Escribimos los errores al error.log con rotacion diaria
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m',
      zippedArchive: true
    }),
    // Escribimos todos los logs al combined.log con rotacion diaria
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      zippedArchive: true
    })
  ]
});

// Agregamos tranporte para entornos de no-produccion
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),  // Salidad por consola colorizada
      winston.format.simple(),    // Formato para consola simplificado
      winston.format.printf(({ level, message, timestamp }) => { return `${timestamp} [${level}] ${message}`; })
    )
  }));
}

// Stream para Morgan peticion HTTP logging
logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;