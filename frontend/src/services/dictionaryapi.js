import axios from 'axios'
const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en'

const getPhonetics = async (word) => {
  try {
    const response = await axios.get(`${baseUrl}/${word}`)

    const phoneticsArray = response.data.flatMap(entry => entry.phonetics || [])

    const text = phoneticsArray.find(p => p.text)?.text || null
    const audio = phoneticsArray.find(p => p.audio)?.audio || null

    return {
      text,
      audio
    }
  }
  catch {
    return null   // not in dictionaryapi.dev
  }
}

export default { getPhonetics }