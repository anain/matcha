import { put, takeEvery, call } from 'redux-saga/effects'

export function* socketWatcher() {
	yield takeEvery('SOCKET_UNSUBSCRIBE', unsubscribeSocket)
	yield takeEvery('MESSAGE_SEND', sendMessage)
}

function* unsubscribeSocket () {
}

function* sendMessage (payload) {
    try {
        yield put({type: 'SEND_MESSAGE_REQUEST'})
        yield put({type: 'SEND_MESSAGE_SUCCESS', payload})
    } catch (err) {
        yield put({type: 'SEND_MESSAGE_FAILURE', err})
    }
}