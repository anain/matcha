import { put, takeEvery, call, select } from 'redux-saga/effects'
import { login, getPicture, changePwdSettings, logout,
	getNotifications, validResetPassword, upload, getGeoloc,
	getNotificationCount, resetPassword, editMailSettings } from '../../actions/login'
import { historyPush } from '../../config/history'
import { sockTools } from '../soketClient'
import { getSelectedId, userId } from '../reducers'

const socket = new sockTools()

export function* sessionWatcher() {
	yield takeEvery('LOGIN_USER', userLogin)
	yield takeEvery('LOGOUT_USER', userLogout)
	yield takeEvery('GET_PICTURE', getUserPicture)
	yield takeEvery('GET_NOTIFICATIONS', getUserNotifications)
	yield takeEvery('UPLOAD_PICTURE', uploadPicture)
	yield takeEvery('ADD_MSG_NOTIF', addMsgNotif)
	yield takeEvery('GET_USER_GEOLOC', getUserGeoloc)
	yield takeEvery('GET_NOTIFICATION_COUNT', getNot)
	yield takeEvery('RESET_PWD', resetpwd)
	yield takeEvery('VALID_RESET_PWD', validateResetpwd)
	yield takeEvery('CHANGE_PASSWORD_SETTINGS', changePasswordSettings)
	yield takeEvery('EDIT_MAIL', editMail)
}

function* addMsgNotif (data) {
	const selectedId = yield select(getSelectedId)
	if (selectedId.selectedId !== data.payload){
		yield put({type: 'ADD_MSG_NOTIF_SUCCESS'})
	}
}

function* userLogin (data) {
	try {
		yield put({type: 'LOGIN_USER_REQUEST'})
		const res = yield call(login, data.payload)
		yield call(() => socket.disconnect())
		yield call(() => socket.connect())
		yield call(socket.emit, 'login', res.data.id)
		yield put({type: 'LOGIN_USER_SUCCESS', payload: res})
		yield historyPush(`/home`)
	} catch (error) {
		yield put({type: 'LOGIN_USER_FAILURE', payload: error})
	}
}

function* userLogout () {
	try {
		yield put({type: 'LOGOUT_USER_REQUEST'})
		yield historyPush(`/welcome`)		
		const id = yield select(userId)
		if (id){
			socket.removeAllListeners('disconnnect_' + id)
			socket.removeAllListeners('connect_' + id)
		}
		socket.removeAllListeners('private_message')
		socket.removeAllListeners('message_was_sent')
		socket.removeAllListeners('notif')
		socket.removeAllListeners('connect')
		socket.removeAllListeners('disconnect')
		socket.removeAllListeners('new_message')
		const res = yield call(logout)
		yield call(socket.emit, 'logout')
		yield call(()=> socket.disconnect())
		yield put({type: 'LOGOUT_USER_SUCCESS', payload: res})
	} catch (error) {
		yield put({type: 'LOGOUT_USER_FAILURE', payload: error})
	}
}


function* getUserPicture () {
	try {
		yield put({type: 'GET_PICTURE_REQUEST'})
		const res = yield call(getPicture)
		if (!res.data.id) historyPush('/redirection')
		yield put({type: 'GET_PICTURE_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_PICTURE_FAILURE', payload: error})
	}
}

function* editMail (data) {
	try {
		yield put({type: 'EDIT_MAIL_REQUEST'})
		const res = yield call(editMailSettings, data.payload)
		const infos = {
			res: res,
			data: data
		}
		yield put({type: 'EDIT_MAIL_SUCCESS', payload: infos})
	} catch (error) {
		yield put({type: 'EDIT_MAIL_FAILURE', payload: error})
	}
}

function* getUserNotifications () {
	try {
		yield put({type: 'GET_NOTIFICATIONS_REQUEST'})
		const res = yield call(getNotifications)
		yield put({type: 'GET_NOTIFICATIONS_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_NOTIFICATIONS_FAILURE', payload: error})
	}
}

function* uploadPicture (data) {
	try {
		yield put({type: 'UPLOAD_PICTURE_REQUEST'})
		const res = yield call(upload, data.payload.formData)
		yield put({type: 'UPLOAD_PICTURE_SUCCESS', payload: {data: res.data, index: data.payload.index}})
	} catch (error) {
		yield put({type: 'UPLOAD_PICTURE_FAILURE', payload: error})
	}
}

function *getUserGeoloc () {
	try {
		yield put({type: 'GET_USER_GEOLOC_REQUEST'})
		const res = yield call(getGeoloc)
		yield put({type: 'GET_USER_GEOLOC_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_USER_GEOLOC_FAILURE', payload: error})
	}
}

function *changePasswordSettings (input) {
	try {
		yield put({type: 'CHANGE_PASSWORD_SETTINGS_REQUEST'})
		const res = yield call(changePwdSettings, input.payload)
		yield put({type: 'CHANGE_PASSWORD_SETTINGS_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'CHANGE_PASSWORD_SETTINGS_FAILURE', payload: error})
	}
}

function *resetpwd (input) {
	try {
		yield put({type: 'RESET_PWD_REQUEST'})
		const res = yield call(resetPassword, input.payload)
		yield put({type: 'RESET_PWD_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'RESET_PWD_FAILURE', payload: error})
	}
}

function *validateResetpwd (input) {
	try {
		yield put({type: 'RESET_PWD_REQUEST'})
		const res = yield call(validResetPassword, input.payload)
		yield put({type: 'RESET_PWD_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'RESET_PWD_FAILURE', payload: error})
	}
}

function *getNot() {
	try {
		yield put({type: 'GET_NOTIFICATION_COUNT_REQUEST'})
		const res = yield call(getNotificationCount)
		yield put({type: 'GET_NOTIFICATION_COUNT_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_NOTIFICATION_COUNT_FAILURE', payload: error})
	}
}