import { put, takeEvery, call } from 'redux-saga/effects'
import { getUsersList, getOldMessages, setSeen } from '../../actions/privateMessages'
export function* messagesWatcher() {
	yield takeEvery('GET_MESSAGES', getMessages)
	yield takeEvery('SOCKET_UPDATE', socketUpdate)
	yield takeEvery('STORE_CONTACT_LIST', storeContactList)
	yield takeEvery('SELECT_ID', messageSeen)
}

function* getMessages (data) {
	try {
		yield put({type: 'GET_MESSAGES_REQUEST'})
		const messages = yield call(getOldMessages, data)
		yield put({type: 'GET_MESSAGES_SUCCESS', payload: messages.data})
	} catch (err) {
		yield put({type: 'GET_MESSAGES_FAILURE', err})
	}
}

function* storeContactList () {
	try {
		yield put({type: 'STORE_CONTACT_LIST_REQUEST'})
		const contactList = yield call(getUsersList)
		yield put({type: 'STORE_CONTACT_LIST_SUCCESS', payload: contactList.data})
	} catch (err) {
		yield put({type: 'STORE_CONTACT_LIST_FAILURE', err})
	}
}

function* socketUpdate (data) {
	yield put({type: 'SOCKET_UPDATE_SUCCESS', payload: data})
}

function* messageSeen (data) {
	try {
		yield put({type: 'SELECT_ID_SUCCESS', payload: data.payload})
		if (data.payload)
		{
			yield put({type: 'SET_SEEN_REQUEST'})
			yield put({type: 'MSG_NB_UPDATE_SUCESS', payload: data.payload})
			yield call(setSeen, data)
			yield put({type: 'SET_SEEN_SUCCESS', payload: data.payload})
		}
	} catch (err) {
		yield put({type: 'SET_SEEN_FAILURE', err})
	}
}