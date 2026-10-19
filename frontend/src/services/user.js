import axios from 'axios'
const baseUrl = '/api/users'

const getCurrentUser = async () => {
  const response = await axios.get(`${baseUrl}/me`)
  return response.data
}

export default {
  getCurrentUser
}