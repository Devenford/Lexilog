import axios from 'axios'

const baseUrl = '/api/practice'


const getMultipleChoiceWords = async () => {
  const response = await axios.get(`${baseUrl}/multiple-choice`)
  /*
  The JWT is stored in an HTTP-only cookie, so the browser automatically
  sends it with requests. No need to manually add an Authorization header.
  */
  return response.data
}

const sendMultipleChoiceResults = async results => {
  const response = await axios.post(`${baseUrl}/multiple-choice`, results)
  /*
  The JWT is stored in an HTTP-only cookie, so the browser automatically
  sends it with requests. No need to manually add an Authorization header.
  */

  return response.data
}

export { getMultipleChoiceWords, sendMultipleChoiceResults }