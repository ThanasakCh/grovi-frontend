// API Configuration
export const API_CONFIG = {
  // Base URL for API calls - using localhost for development
  BASE_URL: 'http://localhost:8000',
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`
}

// Helper function to get full image URL
export const getImageUrl = (imagePath: string) => {
  // If it's already a full URL (http/https) or Base64 data URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  
  // If it's a relative path starting with /, remove the leading slash
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  // Return full URL using backend base URL
  return `${API_CONFIG.BASE_URL}/${cleanPath}`
}
