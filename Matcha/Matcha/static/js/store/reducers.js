import * as c from './constants'
import moment from 'moment'
import {isArray} from 'lodash'
moment.locale('fr')

const initialHomeState = {
	matches: [],
	searchResults: [],
	searchCrit: [],
	searchOrder: 6,
	currentMatchOrder: 1,
	tags: [],
	getMatchesRequesting: null,
	getSearchRequesting: null,
	getLastSearchRequesting: null,
	getTagsRequesting: null,
	getMatchFilterRequesting: null,
	searchTags: [],
	error: [],
}

export const getMatchesList = (state) => {
	const matchesId = []
	for (var i = 0; i < state.home.matches.length; i++)
		matchesId.push(state.home.matches[i]['id'])
	return matchesId
}

export const homeReducer = (state = initialHomeState, {type, payload}) => {
	switch (type) {
		case c.ORDER_MATCHES:
		let newMatch = []
			switch(payload.toString()) {
				case "1":
				newMatch = state.matches.sort((a, b) => (b.distance - a.distance))
				break;
				case "2":
				newMatch = state.matches.sort((a, b) => (a.age_diff - b.age_diff))
				break;
				case "3":
				newMatch = state.matches.sort((a, b) => (b.tag_score - a.tag_score))
				break;
				case "4":
				newMatch = state.matches.sort((a, b) => (parseInt(b.age) - parseInt(a.age)))
				break;
				case "5":
				newMatch = state.matches.sort((a, b) => (parseInt(a.age) - parseInt(b.age)))
				break;
				case "6":
				newMatch = state.matches.sort((a, b) => (b.popularity_mark - a.popularity_mark))
				break;
			}

			return {
				...state,
				matches: newMatch,
				currentMatchOrder: payload
			}


		case c.GET_LAST_SEARCH_REQUEST:
			return {
			...state,
			getLastSearchRequesting: true
			}
		case c.GET_LAST_SEARCH_SUCCESS:
			let lastRes = payload.res;
			let lastResTab = []
			if (lastRes){
				Object.values(lastRes).map((content, index) => {
					lastResTab[index] = content
				})
			}
			return {
				...state,
				searchResults: lastResTab,
				searchOrder: payload.crit && payload.crit.currentOrder ? payload.crit.currentOrder : state.searchOrder,
				searchCrit: payload.crit ? payload.crit : state.searchCrit,
				searchTags: payload.crit  && payload.crit.tagsStorage? payload.crit.tagsStorage : state.searchTags,
				getLastSearchRequesting: false,
			}
		case c.GET_LAST_SEARCH_FAILURE:
			return {
			...state,
			getLastSearchRequesting: false,
			error: payload
		}

		case c.GET_MATCH_FILTER_REQUEST:
			return {
			...state,
			getMatchFilterRequesting: true,
			}
		case c.GET_MATCH_FILTER_SUCCESS:
		let matchFil = payload.res;
		if (!matchFil)
		return {
			...state,
			searchResults: [],
			searchOrder: payload.crit && payload.crit.currentOrder ? payload.crit.currentOrder : state.searchOrder,
			searchCrit: payload.crit ? payload.crit : state.searchCrit,
		}
		let matchFilTab = []
		Object.values(matchFil).map((content, index) => {
				matchFilTab[index] = content
			});
		return {
			...state,
			searchResults: matchFilTab,
			searchOrder: payload.crit && payload.crit.currentOrder ? payload.crit.currentOrder : state.searchOrder,
			searchCrit: payload.crit ? payload.crit : state.searchCrit,
			getMatchFilterRequesting: false,
		}
		case c.GET_MATCH_FILTER_FAILURE:
			return {
			...state,
			getMatchFilterRequesting: false,
			error: payload
		}
	
		case c.GET_MATCHES_REQUEST:
			return {
				...state,
				getMatchesRequesting: true
			}
		case c.GET_MATCHES_SUCCESS:
			let matches = payload.res ? (JSON.parse(payload.res)) : {};
			let tab = []
			Object.values(matches).map((content) => {
				tab.push(content)
			});
			return {
				...state,
				matches: tab,
				getMatchesRequesting: false,
				currentMatchOrder: payload.order
			}
		case c.GET_MATCHES_FAILURE:
			return {
				...state,
				getMatchesRequesting: false,
				error: payload
			}
		case c.GET_SEARCH_REQUEST:
			return {
				...state,
				getSearchRequesting: true
			}
		case c.GET_SEARCH_SUCCESS:
			let res = payload.res
			let resTab = []
			if (payload.crit.newSearch == false)
			{
				resTab = state.searchResults
			}
			if (res)
			{
				Object.values(res).map((content, index) => {
				resTab.push(content)
				});
			}
			return {
				...state,
				searchResults: resTab,
				searchOrder: payload.crit.currentOrder,
				searchCrit: payload.crit,
				getSearchRequesting: false,
				searchTags: payload.crit.tagsStore
			}
		case c.GET_SEARCH_FAILURE:
			return {
				...state,
				getSearchRequesting: false,
				error: payload
			}
		
		case c.GET_TAGS_REQUEST:
			return {
				...state,
				getTagsRequesting: true
			}
		case c.GET_TAGS_SUCCESS:
			let rawtTags = (JSON.parse(payload));
			let tagList = []
			Object.values(rawtTags).map((content, index) => {
				tagList[index] = content
			});
			return {
				...state,
				tags: tagList,
				getTagsRequesting: false,
			}
		case c.GET_TAGS_FAILURE:
			return {
				...state,
				getTagsRequesting: false,
				error: payload
			}

		case c.LOGOUT_USER_SUCCESS:
			return {
				...initialHomeState
			}
		
		default:
			return {
				...state
			}
	}
}



const initialUserState = {
	geoloc_show: false,
	sendLikeRequesting: false,
	profession: null,
	score: null,
	id: null,
	self: false,
	username: null,
	gender: null,
	sex_orientation: null,
	first_name: null,
	name: null,
	profession: null,
	pics: null,
	geoloc_city: null,
	geoloc_lat: null,
	geoloc_long: null,
	long_desc: null,
	short_desc: null,
	birth_date: null,
	tags_list: null,
	liked: false,
	blocked: false,
	online: false,
	last_connection: null,
	pics: null,
	profilePicture: null,
	editReq: false,
	blocks: false,
	getProfileRequesting: false,
	age: null,
	editTagsRequesting: false,
	geoloc_postal_code: null,
	sendBlockRequesting: false,
	error: []
}

export const userId = (state)=>{
	return state.users.id
}

export const userReducer = (state = initialUserState, {type, payload}) => {
	switch (type) {
		case c.GET_PROFILE_REQUEST:
			state = initialUserState
			return {
				...state,
				getProfilerRequesting: true
			}
		case c.GET_PROFILE_SUCCESS:
			const pics = payload && payload.pictures ? JSON.parse(payload.pictures) : {}
			const tags = payload && payload.tags_list ? JSON.parse(payload.tags_list) : {}
			let tagsLabel = []
			let tagsId = []
			var initialPic = state.profilePicture
			pics.forEach((pic)=>{
				if (pic.profile_pic){
					initialPic = pic.img
				}
			})
			tags.forEach((tag)=>{
				tagsLabel.push(tag.label)
				tagsId.push(tag.id)
			})
			return {
				...state,
				geoloc_postal_code: payload.geoloc_postal_code,
				geoloc_show: payload.geoloc_show !== null ? payload.geoloc_show : true,
				id: payload.id,
				self: payload.self,
				username: payload.username,
				gender: payload.gender,
				sex_orientation: payload.sex_orientation,
				first_name: payload.first_name,
				name: payload.name,
				profession: payload.profession,
				pics: pics,
				geoloc_city: payload.geoloc_city,
				geoloc_lat: payload.geoloc_lat,
				geoloc_long: payload.geoloc_long,
				long_desc: payload.long_desc,
				short_desc: payload.short_desc,
				birth_date: payload.birth_date,
				tags: tags,
				tags_id: tagsId,
				tags_list: tagsLabel,
				liked: payload.liked,
				blocked: payload.blocked,
				online: payload.online,
				last_connection: payload.last_connection,
				profilePicture: initialPic,
				score: payload.score,
				blocks: payload.blocks,
				getProfileRequesting: false,
				age: payload.birth_date && moment().diff(moment(payload.birth_date, 'YYYY-MM-DD'), 'years'),
				error: []
			}
		case c.GET_PROFILE_FAILURE:
			return {
				...state,
				error: payload
			}

		case c.UPLOAD_PICTURE_SUCCESS:
			
			let pic = payload.data.img
			let index = payload.index
			let tab = state.pics
			if (index !== null) tab[index]=pic
			return {
				...state,
				pics: tab,
			}

		case c.EDIT_PROFILE_REQUEST:
			return {
				...state,
				editReq: true,
			}

		case c.EDIT_PROFILE_SUCCESS:
			const data = payload ? payload.data : null
			const field = data && data.field ? data.field : ''
			return {
				...state,
				age: data && data.field && data.field === 'birth_date' ? moment().diff(moment(data.new_value, 'YYYY-MM-DD'), 'years') : state.age,
				[field]: data && data.new_value ? data.new_value: '',
				editReq: false,
			}

		case c.EDIT_PROFILE_FAILURE:
			return {
				...state,
				editReq: false,
			}

		case c.UPDATE_GEOLOC_SUCCESS:
			return {
				...state,
				geoloc_show: payload.new_value,
			}
					
		case c.SEND_LIKE_REQUEST:
			return {
				...state,
				sendLikeRequesting: true
			}

		case c.SEND_LIKE_SUCCESS:
			return {
				...state,
				liked: !state.liked,
				sendLikeRequesting: false
			}

		case c.SEND_LIKE_FAILURE:
			return {
				...state,
				error: payload
			}

		case c.SEND_BLOCK_REQUEST:
			return {
				...state,
				sendBlockRequesting: true
			}

		case c.SEND_BLOCK_SUCCESS:
			return {
				...state,
				blocked: !state.blocked,
				sendBlockRequesting: false
			}

		case c.SEND_BLOCK_FAILURE:
			return {
				...state,
				sendBlockRequesting: false,
				error: payload
			}

		case c.SEND_UNBLOCK_REQUEST:
			return {
				...state,
				sendBlockRequesting: true
			}

		case c.SEND_UNBLOCK_FAILURE:
			return {
				...state,
				sendBlockRequesting: false,
				error: payload
			}

		case c.EDIT_TAGS_REQUEST:
			return {
				...state,
				editTagsRequesting: true
			}
		case c.EDIT_TAGS_SUCCESS:
			let rawtTags = payload.data
			let tagList = []
			Object.values(rawtTags).map((content, index) => {
				tagList[index] = content.label
			});
			return {
				...state,
				tags_list: tagList,
				editTagsRequesting: false,
			}
		case c.EDIT_TAGS_FAILURE:
			return {
				...state,
				editTagsRequesting: false,
				error: payload
			}

		case c.LOGOUT_USER_SUCCESS:
			return {
				...initialUserState
			}
		default:
			return {
				...state
			}
	}
}

const initialSessionState = {
	id: null,
	geoloc_empty: false,
	complete: true,
	username: null,
	loginErr: false,
	error: [],
	notifications: [],
	loginUserDatas: null,
	storeSessionRequesting: null,
	registerUserRequesting: false,
	loginUserRequesting: false,
	getNotificationsRequesting: false,
	logoutUserRequesting: false,
	uploadPictureRequesting: false,
	uploadedPictures: [],
	getUserGeolocRequesting: false,
	geoloc: null,
	newMsg: 0,
	newNot: 0,
	registerErr: false,
	profilePicture: null,
	picId: null,
	getNotificationCountRequesting: null,
	resetPwdRequesting: false,
	success: false,
	changePwdError: false,
	mail: ''
}

export const sessionReducer = (state = initialSessionState, {type, payload}) => {
	switch (type) {
		case c.GET_USER_GEOLOC_REQUEST:
			return {
				...state,
				getUserGeolocRequesting: true
		}
		case c.GET_USER_GEOLOC_SUCCESS:
			return {
				...state,
				geoloc: payload,
				getUserGeolocRequesting: false
		}
		case c.GET_USER_GEOLOC_FAILURE:
			return {
				...state,
				error: payload,
				getUserGeolocRequesting: false
			}

		case c.LOGIN_USER_REQUEST:
			return {
				...state,
				loginUserRequesting: true
			}

		case c.RESET_PWD_REQUEST:
			return {
				...state,
				success: false,
				resetPwdRequesting: true
			}
		case c.RESET_PWD_SUCCESS:
			return {
				...state,
				resetPwdRequesting: false,
				success: true,
			}
		case c.RESET_PWD_FAILURE:
			return {
				...state,
				resetPwdRequesting: false,
				success: false,
			}

		case c.EDIT_MAIL_REQUEST:
			return {
				...state,
				success: false,
			}
		case c.EDIT_MAIL_SUCCESS:
			return {
				...state,
				success: true,
			}
		case c.EDIT_MAIL_FAILURE:
			return {
				...state,
				success: false,
			}

		case c.CHANGE_PASSWORD_SETTINGS_REQUEST:
			return {
				...state,
				changePwdError: false,
				success: false,
				resetPwdRequesting: true
			}
		case c.CHANGE_PASSWORD_SETTINGS_SUCCESS:
			return {
				...state,
				changePwdError: false,
				resetPwdRequesting: false,
				success: true,
			}
		case c.CHANGE_PASSWORD_SETTINGS_FAILURE:
			return {
				...state,
				changePwdError: true,
				resetPwdRequesting: false,
				success: false
			}

		case c.EDIT_MAIL_REQUEST:
			return {
				...state,
			}
		case c.EDIT_MAIL_SUCCESS:
			return {
				...state,
				success: true
			}

		case c.EDIT_MAIL_FAILURE:
			return {
				...state,
			}

		case c.EDIT_PROFILE_SUCCESS:
			let res = payload ? payload.res.data.complete : null
			return {
				...state,
				complete: res ? res : state.complete
			}

		case c.EDIT_TAGS_SUCCESS:
			res = payload ? payload.res.data.complete : null
			return {
				...state,
				complete: res ? res : state.complete
			}
		
		case c.LOGIN_USER_SUCCESS:
			return {
				...state,
				loginErr: false,
				id: payload.id,
				username: payload.username,
				loginUserRequesting: false,
			}
		case c.LOGIN_USER_FAILURE:
			return {
				...state,
				loginErr: true,
				loginUserRequesting: false,
				error: payload.response
			}
		
		case c.LOGOUT_USER_REQUEST:
			return {
				...state,
				logoutUserRequesting: true
			}
		case c.LOGOUT_USER_SUCCESS:
			return {
				...initialSessionState		
			}
		case c.LOGOUT_USER_FAILURE:
			return {
				...state,
				logoutUserRequesting: false,
				error: payload
			}

		case c.REGISTER_USER_REQUEST:
			return {
				...state,
				registerUserRequesting: true
			}
		case c.REGISTER_USER_SUCCESS:
			return {
				...state,
				registerErr: false,
				registerUserRequesting: false,
			}
		case c.REGISTER_USER_FAILURE:
			return {
				...state,
				registerErr: true,
				registerUserRequesting: false,
				error: payload
			}

		case c.GET_PICTURE_REQUEST:
			return {
				...state,
				getPictureRequesting: true
			}
		case c.GET_PICTURE_SUCCESS:
			return {
				...state,
				mail: payload.mail,
				geoloc_empty: payload.geoloc_empty,
				complete: payload.complete,
				id: payload.id,
				picId: payload.pic_id,
				newMsg: payload.msg_count,
				profilePicture: payload.img,
				username: payload.username,
				getPictureRequesting: false,
				error: payload
			}
		case c.GET_PICTURE_FAILURE:
			return {
				...state,
				getPictureRequesting: false,
				error: payload
			}
		case c.ADD_MSG_NOTIF_SUCCESS:
			return {
				...state,
				newMsg: state.newMsg + 1,
			}

		case c.GET_NOTIFICATION_COUNT_REQUEST:
			return {
				...state,
				getNotificationCountRequesting: true
			}
		case c.GET_NOTIFICATION_COUNT_SUCCESS:
			return {
				...state,
				newNot: payload.new,
				getNotificationCountRequesting: false,
			}
		case c.GET_NOTIFICATION_COUNT_FAILURE:
			return {
				...state,
				getNotificationCountRequesting: false,
				error: payload
			}
		case c.GET_NOTIFICATIONS_REQUEST:
			return {
				...state,
				getNotificationsRequesting: true
			}
		case c.GET_NOTIFICATIONS_SUCCESS:
			let notif = payload ? payload : {};
			let tab = []
			Object.values(notif).map((content, index) => {
			tab[index] = content
			});
			return {
				...state,
				notifications: tab,
				newNot: 0,
				getNotificationsRequesting: false,
			}
		case c.GET_NOTIFICATIONS_FAILURE:
			return {
				...state,
				getNotificationsRequesting: false,
				error: payload
			}
		case c.NOTIF_SOCKET_UPDATE_SUCESS:
			return {
				...state,
				newNot: state.newNot + 1
			}

		case c.MSG_NB_UPDATE_SUCESS:
			const readMsg = payload.msg_nb
			const t = state.newMsg - readMsg
			return {
				...state,
				newMsg: t >= 0 ? t : 0 
			}

		case c.UPLOAD_PICTURE_REQUEST:
			return {
				...state,
				uploadPictureRequesting: true
			}
		case c.UPLOAD_PICTURE_SUCCESS:
			
			let pic = payload.data.img
			return {
				...state,
				complete: payload.data.complete,
				profilePicture: pic.profile_pic ? pic.img : state.profilePicture,
				uploadPictureRequesting: false,
			}
		case c.UPLOAD_PICTURE_FAILURE:
			return {
				...state,
				uploadPictureRequesting: false,
				error: payload
			}

		default:
			return {
				...state
			}
	}
}

const initialInteractionsState = {
	sendMessageRequesting: false,
	online: false,
	last_connection: null,
	error: [],
}

export const interactionsReducer = (state = initialInteractionsState, {type, payload}) => {
	switch (type) {
		case c.CONNECTION_STATUS_UPDATE:
		return {
			...state,
			online: true
		}

		case c.SEND_MESSAGE_REQUEST:
			return {
				...state,
				sendMessageRequesting: true
			}

		case c.SEND_MESSAGE_SUCCESS:
			return {
				...state,
				sendMessageRequesting: false
			}

		case c.SEND_MESSAGE_FAILURE:
			return {
				...state,
				error: payload
			}

		case c.SEND_DISLIKE_REQUEST:
			return {
				...state,
				sendDislikeRequesting: true
			}

		case c.SEND_DISLIKE_FAILURE:
			return {
				...state,
				error: payload
			}

		case c.LOGOUT_USER_SUCCESS:
			return {
				...initialInteractionsState,
			}
		default:
			return {
				...state
			}
	}
}

const initialMessagesState = {
	getMessagesRequesting: false,
	getMessagesError: [],
	messages: [],
	storeContactListRequesting: false,
	setAsSeenRequesting: false,
	error: [],
	contactList: [],
	newMsg: null,
	notif: false,
	selectedId : null,
	selectedUsername : null,
	stopGetHistory: 0
}

export const getSelectedId = (state) => { return {
	selectedId: state.messages.selectedId,
	selectedUsername: state.messages.selectedUsername
 } }

export const messagesReducer = (state = initialMessagesState, {type, payload}) => {
	let messages = state.messages
	switch (type) {

		case c.GET_MESSAGES_REQUEST:
			return {
				...state,
				getMessagesRequesting: true
			}

		case c.GET_MESSAGES_SUCCESS:
		let conv = payload.content ? (JSON.parse(payload.content)) : {};
		let stop = conv.length > 0 ? 0 : 1
		let id = payload.id
		let content = messages
		if (messages && messages[id] && isArray(messages[id])) {
			content[id].unshift(...conv)
		}
		return {
				...state,
				messages: messages && messages[id] ? content : { ...messages, [id]: conv},
				getMessagesRequesting: false,
				stopGetHistory: stop
			}

		case c.GET_MESSAGES_FAILURE:
			return {
				...state,
				getMessagesError: payload
			}
		
		case c.SELECT_ID_SUCCESS:
			return {
				...state,
				selectedId: payload && payload.contact ? payload.contact : null,
				selectedUsername: payload && payload.username ? payload.username : null,
				contactList: payload ? state.contactList : null,
				messages: payload && payload.contact ? state.messages : []
			}

		
		case c.SEND_LIKE_SUCCESS:
			return {
				...state,
				contactList: [],
			}
			
		case c.SET_SEEN_REQUEST:
			return {
				...state,
				setAsSeenRequesting: true
			}

		case c.SET_SEEN_SUCCESS:
			let list = state.contactList
			if (list && list.length !== 0) {
				list.map((user, id)=>{
					if (user.match_user_id === payload.contact)
					{
						list[id].msg_nb = list[id].msg_nb - payload.msg_nb > 0 ? list[id].msg_nb - payload.msg_nb : 0
					}
				})
			}
			return {
				...state,
				contactList: list,
				setAsSeenRequesting: false
			}
		case c.SET_SEEN_FAILURE:
			return {
				...state,
				setAsSeenRequesting: false
			}



		case c.SOCKET_UPDATE_SUCCESS:
			messages = state.messages
			payload = payload.payload
			conv = payload.content
			const isSender = payload.type === 'sent'
			id = isSender ? payload.content.to_id : payload.content.from_id
			let onSelection = state.selectedId === id ? false : true
			content = messages
			if (messages && messages[id] && isArray(messages[id])) {
				content[id].push(conv)
			}
			const list1 = state.contactList
			if (!isSender && list1 && list1.length !== 0 && state.selectedId !== id)
			{
				list1.map((user, index)=>{
					if (user.match_user_id === id)
					{
						list1[index].msg_nb = list1[index].msg_nb + 1
					}
				})
			}
			return {
				...state,
				notif: isSender ? false : onSelection,
				contactList: list1 ? list1 : state.contactList,
				messages: messages && messages[id] ? content : { ...messages, [id]: [conv]},
			}

		case c.SOCKET_MSG_READ:
			return {
				...state,
			}

		case c.STORE_CONTACT_LIST_REQUEST:
			return {
				...state,
				storeContactListRequesting: true
			}

		case c.STORE_CONTACT_LIST_SUCCESS:
			return {
				...state,
				contactList: payload,
				storeContactListRequesting: false
			}

		case c.STORE_CONTACT_LIST_FAILURE:
			return {
				...state,
				error: payload
			}
		case c.LOGOUT_USER_SUCCESS:
			return {
				...initialMessagesState
			}
		case 'ALLOW_GET_HISTORY':
			return {
				...state,
				stopGetHistory: 0
			}
		
		default:
			return {
				...state
			}
	}
}