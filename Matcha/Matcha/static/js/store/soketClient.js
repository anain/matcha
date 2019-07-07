import io from 'socket.io-client'
const host = 'http://0.0.0.0:5000'

export const socket = io(host)

export class sockTools {
  connect = () => {
    socket.on('connect', () => {})
  }
  
  disconnect = () => {
      socket.on('disconnect', () => {})
  }
  
  emit = (event, data) => {
    if (!socket) historyPush('/redirection');
    else if (data) socket.emit(event, data, (res) => {
    })
    else socket.emit(event, (res) => {
    })
  }
  
  on = (event) => {
    if (!socket) historyPush('/redirection')
    socket.on(event, (msg)=>{
      return msg
    })
  }
}