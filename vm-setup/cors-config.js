/**
 * Configuración CORS para permitir conexiones desde Vercel
 */

const corsConfig = {
  origin: [
    'http://localhost:5173', // Desarrollo local
    'https://*.vercel.app',  // Vercel apps
    'https://tu-app.vercel.app', // Tu app específica
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 horas
};

export default corsConfig;
