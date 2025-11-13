// Configuração da API
const API_CONFIG = {
  // Em desenvolvimento, usar proxy do Vite
  // Em produção, usar URL absoluta
  baseURL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL || 'https://api.example.com'
    : '',
  
  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }
}

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.baseURL}${endpoint}`
}

export default API_CONFIG