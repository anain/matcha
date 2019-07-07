import axios from 'axios'

const host = 'http://0.0.0.0:5000'

export const login = (input) => {
	return axios({
		method: 'POST',
		url: host + '/login/',
		data: input,
		withCredentials: true,
	})
}

export const logout = () => {

	return axios({
		method: 'POST',
		url: host + '/logout/',
		withCredentials: true
	})
}

export const register = (input) => {
	return axios({
		method: 'POST',
		url: host + '/createuser',
		data: input,
		withCredentials: true
	})
}

export const getPicture = () => {
	return axios({
		method: 'GET',
		url: host + '/profile/navbar/',
		withCredentials: true
	})
}

export const getNotifications = () => {
	return axios({
		method: 'GET',
		url: host + '/notifications/getlist/',
		withCredentials: true,
	})
}

export const resetPassword = (input) => {
	return axios({
		method: 'POST',
		url: host + '/resetpwd/',
		data: input,
		withCredentials: true,
	})
}

export const changePwdSettings = (input) => {
	return axios({
		method: 'POST',
		url: host + '/settings/resetpwd/',
		withCredentials: true,
		data: input
	})
}

export const editMailSettings = (input) => {
	return axios({
		method: 'POST',
		url: host + '/updatemail/',
		withCredentials: true,
		data: input
	})
}

export const validResetPassword = (input) => {
	return axios({
		method: 'POST',
		url: host + '/user/resetpassword/validate/',
		data: input,
		withCredentials: true,
	})
}

export const upload = (input) => {
	return axios({
		method: 'POST',
		url: host + '/upload/',
		data: input,
		withCredentials: true,
	})
}

const ipGeoloc = () => {
	return axios.get('https://api.ipify.org?format=json').then((res) => {
		const ip = res.data.ip
		return axios({
			method: 'GET',
			url: `https://geo.ipify.org/api/v1?apiKey=at_pGJFOGc5WOyG3zNGv6qaapz0vEJQD&ipAddress=${ip}`,
			// url: `https://geo.ipify.org/api/v1?apiKey=at_3De2851e9PfJHam3hCcJMz0cXM1QK&ipAddress=${ip}`,
		})
	})
}

export const getGeoloc = () => {
	return ipGeoloc()
}

export const getNotificationCount = () => {
	return axios({
		method: 'POST',
		url: host + '/notifications/getcount/',
		withCredentials: true
	})
}

