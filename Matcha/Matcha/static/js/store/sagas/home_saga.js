import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getMatches, getSearch, getTags, getLastSearch, getMatchFilter, removeFromMatches } from '../../actions/suggestions'
import { getMatchesList } from '../reducers'

export function* homeWatcher() {
	yield takeEvery('GET_MATCHES', getUserMatches)
	yield takeEvery('GET_SEARCH', getUserSearch)
	yield takeEvery('GET_LAST_SEARCH', getUserLastSearch)
	yield takeEvery('GET_TAGS', getTagsList)
	yield takeEvery('GET_TAGS', getTagsList)
	yield takeEvery('GET_MATCH_FILTER', matchFilter)
	yield takeEvery('NO_GO', removeUserFromMatches)
}

function* getUserMatches (data) {
	try {
		yield put({type: 'GET_MATCHES_REQUEST'})
		const res = yield call(getMatches, data.payload)
		const matchRes = {"res": res.data, "order": data.payload.order}
		yield put({type: 'GET_MATCHES_SUCCESS', payload: matchRes})
	} catch (error) {
		yield put({type: 'GET_MATCHES_FAILURE', payload: error})
	}	
}

function* getUserLastSearch () {
	try {
		yield put({type: 'GET_LAST_SEARCH_REQUEST'})
		const critRes = yield call(getLastSearch)
		if (!critRes)
			yield put({type: 'GET_LAST_SEARCH_SUCCESS', payload: {res: null, crit: null}})
		else
		{
			const searchRes = yield call(getSearch, critRes.data)
			yield put({type: 'GET_LAST_SEARCH_SUCCESS', payload: searchRes.data})
		}
	} catch (error) {
		yield put({type: 'GET_LAST_SEARCH_FAILURE', payload: error})
	}
}

function* getUserSearch (data) {
	try {
		yield put({type: 'GET_SEARCH_REQUEST'})
		const res = yield call(getSearch, data.payload)
		yield put({type: 'GET_SEARCH_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_SEARCH_FAILURE', payload: error})
	}
}

function* getTagsList () {
	try {
		yield put({type: 'GET_TAGS_REQUEST'})
		const res = yield call(getTags)
		yield put({type: 'GET_TAGS_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_TAGS_FAILURE', payload: error})
	}
}

function* matchFilter (data) {
	try {
		yield put({type: 'GET_MATCH_FILTER_REQUEST'})
		const token = yield select(getMatchesList)
		data.payload.matches = token
		const res = yield call(getMatchFilter, data.payload)
		yield put({type: 'GET_MATCH_FILTER_SUCCESS', payload: res.data})
	} catch (error) {
		yield put({type: 'GET_MATCH_FILTER_FAILURE', payload: error})
	}
}

function* removeUserFromMatches (data) {
	try {
		yield put({type: 'NO_GO_REQUEST'})
		const res = yield call(removeFromMatches, data.payload)
		yield put({type: 'NO_GO_SUCCESS'})
	} catch (error) {
		yield put({type: 'NO_GO_FAILURE', payload: error})
	}	
}