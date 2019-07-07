import createHistory from 'history/createHashHistory'

export default createHistory()

export const historyPush = (path) => {
  const history = createHistory()
  if (history.location.pathname !== path) history.push(path)
}
