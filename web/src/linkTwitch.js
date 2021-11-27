import { useEffect, useState } from 'react'
import axios from 'axios'

export default function linkTwitch(code) {
  useEffect(() => {
    axios
      .post('http://localhost:3001/auth/twitch/callback', { code },{
        headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
      })
      .then((response) => {
          console.log(response);
        //localStorage.setItem('access_token', response.data.data.accessToken)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [code])
}