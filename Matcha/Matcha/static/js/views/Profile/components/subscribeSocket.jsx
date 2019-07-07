import { socket } from '../../../store/soketClient'
import moment from 'moment'
moment.locale('fr')

function subscribeSocket(id, set) {
	if (!socket.hasListeners('disconnect_' + id))
	{
		socket.on('disconnect_' + id, (conData)=> {
			const data = {
				online: false,
				lastCon: conData.last
				}
		set(data)
		})
	}

	if (!socket.hasListeners('connect_' + id))
	{
		socket.on('connect_' + id, ()=> {
			const data = {
				online: true,
				lastCon: null
				}
		set(data)
		})
	}
}

function unSubscribeSocket(id) {
	socket.removeAllListeners('disconnnect_' + id)
	socket.removeAllListeners('connect_' + id)
}

export { subscribeSocket, unSubscribeSocket }