const authEndpoint = 'https://accounts.spotify.com/authorize'
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URL
const clientId = '289bd9a080e04e2da204d59338c23b35'

const scopes = ['user-read-email', 'user-read-private', 'user-read-currently-playing']

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  '%20'
)}`
