export const like = (data) => {
    return {
      type: 'socket',
      types: [SEND, SEND_SUCCESS, SEND_FAIL],
      promise: (socket) => socket.emit('like', data),
    }
  }