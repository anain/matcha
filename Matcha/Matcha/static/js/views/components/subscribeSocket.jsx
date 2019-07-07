import { socket } from '../../store/soketClient'

function getMsgNotif(set) {
	if (!socket.hasListeners('new_message'))
	{
		socket.on('new_message', (data)=>{
			const from = data.from
			set(from)
		})
	}
}


export { getMsgNotif }