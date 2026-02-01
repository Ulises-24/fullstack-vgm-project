const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'DB_URI',
  'DB_DIALECT',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'JWT_SECRET',

  // MICROSOFT
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET',
  'MICROSOFT_TENANT_ID',
  'MICROSOFT_REDIRECT_URI'
];

const missingEnvVar = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVar.length > 0) {
  throw new Error(`Variables de entorno requeridas no encontradas: ${missingEnvVar.join(', ')}`);
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DB_URI: process.env.DB_URI,
  DB_DIALECT: process.env.DB_DIALECT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  // MICROSOFT
  MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
  MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID || 'common',
  MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI
}