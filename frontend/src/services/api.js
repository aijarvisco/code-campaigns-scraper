import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const processedUrlsApi = {
  getAll: async () => {
    const response = await apiClient.get('/processed-urls')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/processed-urls/${id}`)
    return response.data
  },
}

export default apiClient
