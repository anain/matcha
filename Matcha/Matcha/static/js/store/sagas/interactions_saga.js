import { put, takeEvery, call } from 'redux-saga/effects'
import { sockTools } from '../soketClient'

const socket = new sockTools()

export function* interactionsWatcher() {
	yield takeEvery('SOCKET_CONNECT', socketConnect)
	yield takeEvery('SOCKET_DISCONNECT', socketDisconnect)
	yield takeEvery('SEND_MESSAGE', sendMessage)
	yield takeEvery('ON_MSG', onMessage)
	yield takeEvery('ON_MSG_SENT', messageWasSent)
	yield takeEvery('SEND_LIKE', sendLike)
	yield takeEvery('SEND_VIEW', sendView)
	yield takeEvery('SEND_DISLIKE', sendDislike)
	yield takeEvery('SEND_BLOCK', sendBlock)
	yield takeEvery('SEND_UNBLOCK', unBlock)
	yield takeEvery('CONNECTION_STATUS_UPDATE_SUCCESS', connectionStatusUpdate)
}

function* socketConnect () {
	yield call(socket.connect)
}

function* socketDisconnect () {
	yield call(socket.disconnect)
}

function* sendMessage (data) {
	try {
		yield put({type: 'SEND_MESSAGE_REQUEST'})
		yield call(socket.emit, 'private_message', data.payload)
		yield put({type: 'SEND_MESSAGE_SUCCESS'})
	} catch (err) {
		yield put({type: 'SEND_MESSAGE_FAILURE', err})
	}
}

function* onMessage () {
	yield call(socket.on, 'private_message')
}

function* messageWasSent () {
	const ret = yield call(socket.on, 'message_was_sent')
}

function* sendLike (data) {
	try {
		yield put({type: 'SEND_LIKE_REQUEST'})
		yield call(socket.emit, 'like', data.payload)
		yield put({type: 'SEND_LIKE_SUCCESS'})
	} catch (err) {
		yield put({type: 'SEND_LIKE_FAILURE', err})
	}
}

function* sendView (data) {
	try {
		yield put({type: 'SEND_VIEW_REQUEST'})
		yield call(socket.emit, 'view', data.payload)
		yield put({type: 'SEND_VIEW_SUCCESS'})
	} catch (err) {
		yield put({type: 'SEND_VIEW_FAILURE', err})
	}
}

function* sendDislike (data) {
	try {
		yield put({type: 'SEND_DISLIKE_REQUEST'})
		yield call(socket.emit, 'dislike', data.payload)
		yield put({type: 'SEND_LIKE_SUCCESS', payload: data.payload.id})
	} catch (err) {
		yield put({type: 'SEND_DISLIKE_FAILURE', err})
	}
}

function* sendBlock (data) {
	try {
		yield put({type: 'SEND_BLOCK_REQUEST'})
		yield call(socket.emit, 'block', data.payload)
		yield put({type: 'SEND_BLOCK_SUCCESS'})
		yield put({type: 'GET_LAST_SEARCH'})
	} catch (err) {
		yield put({type: 'SEND_BLOCK_FAILURE', err})
	}
}

function* unBlock (data) {
	try {
		yield put({type: 'SEND_UNBLOCK_REQUEST'})
		yield call(socket.emit, 'unblock', data.payload)
		yield put({type: 'SEND_BLOCK_SUCCESS'})
	} catch (err) {
		yield put({type: 'SEND_UNBLOCK_FAILURE', err})
	}
}

function* connectionStatusUpdate (data) {
	yield put({type: 'CONNECTION_STATUS_UPDATE_SUCCESS', payload: data})
}