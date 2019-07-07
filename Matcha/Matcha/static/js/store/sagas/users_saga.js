import { put, takeEvery, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { register } from '../../actions/login'
import { getProfileById, profileEdit, tagsEdit, updateGeoloc } from '../../actions/users'
import { historyPush } from '../../config/history';

export function* usersWatcher() {
	yield takeEvery('GET_USERS', getUsers)
	yield takeEvery('REGISTER_USER', registerUser)
	yield takeEvery('GET_PROFILE', getProfile)
	yield takeEvery('EDIT_PROFILE', editProfile)
	yield takeEvery('UPDATE_GEOLOC', updateGeolocShow)
	yield takeEvery('EDIT_TAGS', editTags)
}

function* getUsers () {
	yield delay(1000)
	const users = yield call(getUsersCallAPI)
	yield put({type: 'GET_USERS_REQUEST'})
	yield put({type: 'GET_USERS_SUCCESS', payload: users.data})
}

function* registerUser (data) {
	try {
		yield put({type: 'REGISTER_USER_REQUEST'})
		const res = yield call(register, data.payload)
		yield put({type: 'REGISTER_USER_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'REGISTER_USER_FAILURE', payload: error})
	}
}

function* getProfile (data) {
	try {
		yield put({type: 'GET_PROFILE_REQUEST'})
		const res = yield call(getProfileById, data.payload)
		yield put({type: 'GET_PROFILE_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_PROFILE_FAILURE', payload: error})
		historyPush('/redirection')
	}
}

function* editProfile (data) {
	try {
		yield put({type: 'EDIT_PROFILE_SUCCESS'})
		const res = yield call(profileEdit, data.payload)
		const input = {
			res: res,
			data: data.payload
		}
		yield put({type: 'EDIT_PROFILE_SUCCESS', payload: input})
	} catch (error) {
		yield put({type: 'EDIT_PROFILE_FAILURE', payload: error})
	}
}

function* updateGeolocShow (data) {
	try {
		yield call(updateGeoloc, data.payload)
		yield put({type: 'UPDATE_GEOLOC_SUCCESS', payload: data.payload})
	} catch (error) {
	}
}

function* editTags (data) {
	try {
		yield put({type: 'EDIT_TAGS_REQUEST'})
		const res = yield call(tagsEdit, data.payload)
		const input = {
			res: res,
			data: data.payload
		}
		yield put({type: 'EDIT_TAGS_SUCCESS', payload: input})
	} catch (error) {
		yield put({type: 'EDIT_TAGS_FAILURE', payload: error})
	}
}