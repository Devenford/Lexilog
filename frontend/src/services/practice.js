import axios from 'axios'
import authService from './auth'

const baseUrl = '/api/practice'


const getMultipleChoiceQuestions = async () => {
  const response = await axios.get(`${baseUrl}/multiple-choice`, authService.getConfig())
  return response.data
}

export default { getMultipleChoiceQuestions }