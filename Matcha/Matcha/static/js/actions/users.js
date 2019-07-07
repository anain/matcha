import axios from 'axios'

const host = 'http://0.0.0.0:5000'
export const getProfileById = (input) => {
	const data = {
		username: input
	}
	return axios({
		method: 'POST',
		url: host + '/profile/',
		data: data,
		withCredentials: true,
	})
}

export const profileEdit = (data) => {
	return axios({
		method: 'POST',
		url: host + '/profile/editprofile/',
		data: data,
	})
}

export const updateGeoloc = (data) => {
	return axios({
		method: 'POST',
		url: host + '/profile/editgeoloc/',
		data: data,
	})
}

export const tagsEdit = (input) => {
	const tagsIdsList = []
	const data = {}
	input.forEach((tag)=>{
		tagsIdsList.push(tag.id)
	})
	data.tags_list = tagsIdsList
	return axios({
		method: 'POST',
		url: host + '/profile/tags/',
		data: data,
	})
}