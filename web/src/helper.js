import axios from 'axios'

export async function verifyAuthenticated() {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken !== undefined || accessToken !== null) {
    const response = await axios.post(
      'http://localhost:3001/auth/token/verify',
      {},
      { headers: { Authorization: 'Bearer ' + accessToken } }
    )

    return !response.data.data.expired
  }
}
