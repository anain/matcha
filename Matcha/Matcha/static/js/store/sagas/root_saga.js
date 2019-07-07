import { sessionWatcher } from './session_saga'
import { messagesWatcher } from './messages_saga'
import { usersWatcher } from './users_saga'
import { interactionsWatcher } from './interactions_saga'
import { all } from 'redux-saga/effects'
import { homeWatcher } from './home_saga';

export default function* rootSaga () {
	yield all([
		sessionWatcher(),
		messagesWatcher(),
		usersWatcher(),
		interactionsWatcher(),
		homeWatcher()
	])
}
  