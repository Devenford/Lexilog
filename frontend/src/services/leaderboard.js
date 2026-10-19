import axios from 'axios'
const baseUrl = '/api/leaderboard'

const getLeaderBoardData = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getLeaderBoardData }