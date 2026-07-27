import axios from 'axios'
import authService from './auth'
const baseUrl = '/api/words'

const getAll = async () => {
  const response = await axios.get(baseUrl, authService.getConfig())
  return response.data
}

const getWord = async word => {
  const response = await axios.get(`${baseUrl}/${word}`, authService.getConfig())
  return response.data
}

// const create = async newObject => {
//   const response = await axios.post(baseUrl, newObject, getConfig())
//   return response.data
// }

// const update = async updatedObject => {
//   const url = `${baseUrl}/${updatedObject.id}`

//   const response = await axios.put(url, updatedObject, getConfig())
//   return response.data
// }

// const deletion = async id => {
//   const url = `${baseUrl}/${id}`

//   await axios.delete(url, getConfig())
// }

export default { getAll, getWord }