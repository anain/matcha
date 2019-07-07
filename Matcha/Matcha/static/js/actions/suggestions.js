import axios from 'axios'

const host = 'http://0.0.0.0:5000'

export const getMatches = (data) => {
	return axios({
		method: 'POST',
		url: host + '/match/',
		data: data,
		withCredentials: true
	})
}

export const getSearch = (data) => {
	return axios({
		method: 'POST',
		url: host + '/search/',
		data: data,
		withCredentials: true
	})
}

export const getLastSearch = () => { 
	return axios({
    method: 'POST',
		url: host + '/lastsearch/',
		withCredentials: true
  })
}

export const getMatchFilter = (data) => { 
	return axios({
    method: 'POST',
		url: host + '/match/filter/',
		data: data,
		withCredentials: true
  })
}

export const removeFromMatches = (data) => { 
	return axios({
    method: 'POST',
		url: host + '/match/remove/',
		data: {"user_id": data},
		withCredentials: true
  })
}

export const getTags = () => { 
	return axios({
    method: 'GET',
		url: host + '/alltags/',
		withCredentials: true
  })
}
