import { socket } from '../../store/soketClient'
import { historyPush } from '../../config/history';

function subscribeNotifications(set) {
	if (!socket.hasListeners('notif'))
	{
		socket.on('notif', () => {
			set()
		})
	}
	if (!socket.hasListeners('disconnect'))
	{
		socket.on('disconnect', () =>{
			historyPush('/redirection')
		})
	}
}

export { subscribeNotifications }