import { createStore } from 'redux'
import { userReducer, messagesReducer, sessionReducer, homeReducer, interactionsReducer } from './reducers'
import { combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/root_saga'

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = applyMiddleware(sagaMiddleware)

const store = createStore(combineReducers({
	users: userReducer,
	messages: messagesReducer,
	session: sessionReducer,
	home: homeReducer,
	interactions: interactionsReducer
}), composeEnhancers(middleware))

sagaMiddleware.run(rootSaga)

export default store