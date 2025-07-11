// Configuration file for environment variables
const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Debug logging
console.log('🔧 Environment Variables Debug:');
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
console.log('Config backendUrl:', config.backendUrl);
console.log('Is Development:', config.isDevelopment);
console.log('Is Production:', config.isProduction);

export default config; 