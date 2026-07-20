let token = null

/*
DO NOT declare and initialize the config at the top:
const config = { headers: {Authorization: token} }

This will cause the token property to be null: config = { headers: {Authorization: null}}
, since the token is initially null.

Define a getConfig fn. to generate the value dynamically:
*/
const getConfig = () => ({
  headers: { Authorization: token }
})

const setToken = newToken => {
  if (!newToken) {
    token = null
  }
  else {
    token = `Bearer ${newToken}`
  }
}

export default { getConfig, setToken }