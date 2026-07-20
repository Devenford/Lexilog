import axios from 'axios'
import authService from './auth'

const baseUrl = '/api/practice'


const getMultipleChoiceWords = async () => {
  const response = await axios.get(`${baseUrl}/multiple-choice`, authService.getConfig())
  return response.data
}

const sendMultipleChoiceResults = async results => {
  const response = await axios.post(`${baseUrl}/multiple-choice`, results, authService.getConfig())
  return response.data
}

export { getMultipleChoiceWords, sendMultipleChoiceResults }