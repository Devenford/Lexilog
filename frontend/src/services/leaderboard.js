import axios from 'axios'
import authService from './auth'
const baseUrl = '/api/leaderboard'

const getLeaderBoardData = async () => {
  const response = await axios.get(baseUrl, authService.getConfig())
  return response.data
}

export default { getLeaderBoardData }