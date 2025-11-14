// Configuração da API
const API_CONFIG = {
  // Em desenvolvimento, usar proxy do Vite
  // Em produção, usar URL absoluta
  baseURL: import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'https://acieicard-backend.onrender.com')
    : '',
  
  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }
}

export const getApiUrl = (endpoint: string) => {
  // Log para debug
  if (import.meta.env.PROD) {
    console.log('🔍 API Config:', {
      PROD: import.meta.env.PROD,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      finalBaseURL: API_CONFIG.baseURL,
      finalEndpoint: `${API_CONFIG.baseURL}${endpoint}`
    })
  }
  return `${API_CONFIG.baseURL}${endpoint}`
}

export default API_CONFIG