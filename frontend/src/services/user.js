import axios from 'axios'
import authService from './auth'
const baseUrl = '/api/users'

const getCurrentUser = async () => {
  const response = await axios.get(`${baseUrl}/me`, authService.getConfig())
  return response.data
}

export default {
  getCurrentUser
}