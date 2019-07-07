import axios from 'axios'

const host = 'http://0.0.0.0:5000'

export const getUsersList = () => {
  return axios({
    method: 'GET',
    url: host + '/messages/getuserslist/',
    withCredentials: true
  })
}

export const getOldMessages = (data) => {
  return axios({
    method: 'POST',
    url: host + '/messages/getmessages/',
    data: data.payload,
    withCredentials: true
  })
}


export const setSeen = (data) => {
  return axios({
    method: 'POST',
    url: host + '/messages/setseen/',
    data: data.payload,
    withCredentials: true
  })
}