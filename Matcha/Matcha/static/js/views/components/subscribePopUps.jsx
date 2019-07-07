import { socket } from '../../store/soketClient'
import moment from 'moment'

function subscribePopUps(set) {
	if (!socket.hasListeners('match'))
	{
		socket.on('match', (res)=>{
			const id = res.contact
			set(id)
		})
	}
}

export { subscribePopUps }