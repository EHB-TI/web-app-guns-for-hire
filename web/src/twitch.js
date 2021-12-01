const authEndpoint = 'https://id.twitch.tv/oauth2/authorize'
const redirectUri = 'http://localhost:3000/profile/'
const clientId = 'jjdpzihsqivv8emhemb7xmfkccko5e'

const scopes = 'user:read:email'

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`
