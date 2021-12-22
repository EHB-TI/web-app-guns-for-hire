const authEndpoint = 'https://id.twitch.tv/oauth2/authorize'
const redirectUri = process.env.REACT_APP_TWITCH_REDIRECT_URL
const clientId = 'jjdpzihsqivv8emhemb7xmfkccko5e'

const scopes = 'user:read:email'

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`
