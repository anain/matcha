import { socket } from '../../../store/soketClient'
import moment from 'moment'
moment.locale('fr')

function subscribeSocket(set) {
	if (!socket.hasListeners('message_was_sent'))
	{
		socket.on('message_was_sent', (res)=>{
			const data = {
				type: 'sent',
				content: {
					content: res.message,
					to_id: res.to,
					from_id: res.from,
					timestamp: moment().format(),
					seen: false
				}
			}
			set(data)
		})
	}

	if (!socket.hasListeners('private_message'))
	{
		socket.on('private_message', (res)=>{
			const data = {
				type: 'received',
				content: {
					content: res.message,
					from_id: res.from,
					to_id: res.to,
					timestamp: moment().format(),
					seen: false
				}
			}
			set(data)
		})
	}
}
export { subscribeSocket }