import React, { Component, createRef } from 'react'
import { style } from '../../styles/styles.jsx'
import Wrapper from "../Wrapper"
import '../../styles/animations/animations.css'
import DesktopMessages from './components/DesktopMessages'
import Tooltip from '@material-ui/core/Tooltip'
import MobileMessages from './components/MobileMessages'
import { subscribeSocket } from './components/subscribeSocket'
import moment from 'moment'
import { historyPush } from '../../config/history'
moment.locale('fr')

const styles = (theme) => {
  return {
    container: {
      ...style.profilPage.container,
      backgroundColor: theme.palette.emptyContentColor,
      width: '100%'
    },
    ...style.messages
  }
}

const ChatListUserContainer = ({selectedId, id, name, picture, classes, onClick, mobile, unread}) => {
  return <div
      className={`fullWidth flex alignCenter ${mobile ? classes.mobileChatListContainer : classes.chatListUserContainer}`}
      onClick={onClick}
      style={selectedId === id
        ? {backgroundColor: '#ff6c6c', borderRadius: '10px', transition: '200ms'}
        : unread
          ? {backgroundColor: 'lightgrey'}
          : null
      }
    >
      {<img
          src={picture ? `data:image/jpeg;base64,${picture}` : 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'}
          alt=''
          className={mobile ? classes.mobilePicture : classes.profilePicture}
          onClick={()=>{historyPush(`/profile/${name}`)}}
        />
      }
      <div
        className={classes.contactLabel}
        style={selectedId === id ? {color: '#ffff', transition: '200ms'} : unread ? {color: 'white'} : null}
      >
        {name}
      </div>
      {unread
          ? <div
          className={`flex center alignCenter`}
          style={{
            color: 'white',
            backgroundColor:'navy',
            borderRadius: '10px',
            position: 'absolute',
            minWidth: '18px'
          }}>
              {`${unread}`}
            </div>
          : null
      }
    </div>
}

const Bubble = ({text, classes, user, time}) => {
  return <div className={`grid-12-noBottom-noGutter alignCenter ${classes.bubbleContainer}`}
    style={user
      ? {justifyContent: 'flex-end', paddingRight: '15px'}
      : {justifyContent: 'flex-start', paddingLeft: '15px'}}
    >
    <Tooltip title={moment(time).format("DD-MM-YYYY h:mm")} placement="left-start">
      <div className={`flex center ${user
        ? classes.bubbleCurrentUser
        : classes.bubbleAnswer}`}
      >
        {text}
      </div>
    </Tooltip>
  </div>
}

class Messages extends Component {
  constructor (props) {
    super(props)
    subscribeSocket((data) => {
			this.props.socketUpdate(data)
		})
    this.handleMessage = this.handleMessage.bind(this)
    this.setRef = this.setRef.bind(this)
    this.messagesEnd = createRef()
    this.handleClick = this.handleClick.bind(this)
    this.getOldMessages = this.getOldMessages.bind(this)
    this.setValue = this.setValue.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.changeContact = this.changeContact.bind(this)
    this.state = {
      userSelected: false,
      width: 0,
      height: 0,
      chatFocused: false,
      message: '',
      offset: {},
    }
  }

  setValue (key, value) {
    this.setState({[key]: value})
  }

  changeContact (value, username, nb) {
    if (value !== this.props.selectedId) {
      this.props.allowGetHistory()
      const data = {
        contact: value,
        username: username,
        msg_nb: nb
      }
      this.props.selectId(data)
      this.getOldMessages()
    }
  }

  getOldMessages () {
    const { offset } = this.state
    const id = this.props.selectedId
    let tmpObj = offset

    if (!offset[id]) {
      tmpObj[id] = 0
    }
    const input = {
      contact: id,
      offset: tmpObj[id]
    }
    if (input.contact && !this.props.messagesRequesting && this.props.stopGetHistory == 0){
      this.props.getConv(input)
      tmpObj[id] = tmpObj[id] + 1
      this.setState({offset: tmpObj})
      this.scrollToBottom()
    }
  }

  handleMessage (message) {
    if (message.charCodeAt(message.length - 1) !== 10) {
      this.setState({message})
    }
  }

  setRef (el) {
    this.messagesEnd = el
  }

  handleClick () {
    let reset = ''
    const data = {
      "message": this.state.message,
      "to": this.props.selectedId
    }
    if (this.state.message.length && data.to !== 0) {
      this.props.sendMessage(data)
      this.setState({
        message: reset
      })
    }
  }
 
  scrollToBottom = () => {
    const { userSelected } = this.state
    const mobileFormat = this.state.width <= 800
    let div = document.getElementById(mobileFormat && userSelected === false
      ? 'mobileUserSelected'
      : 'scroll')
    if (div) {
      div.scrollIntoView({block: 'end'})
    }
  }

  updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    this.props.getContactList()
    this.scrollToBottom()
  }  
  
  componentDidUpdate(oldProps) {
    const newProps = this.props
    this.scrollToBottom()
    if(oldProps.userListReq !== newProps.userListReq && newProps.contactList && newProps.contactList[0] && newProps.contactList[0].match_user_id) {
      if (!this.props.selectedId){
        this.changeContact(newProps.contactList[0].match_user_id, newProps.contactList[0].username, newProps.contactList[0].match_user_id.msg_nb)
      }
    }
  }

  componentWillUnmount() {
    this.props.selectId(null)
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    const { messagesRequesting, complete, sessionUsername } = this.props
    const mobileFormat = this.state.width <= 800
    const hasHistory = true

    return (
      <div
        className={`fullWidth fullHeight`}
      >
        {this.props.sessionId
          ? mobileFormat
            ? <MobileMessages
                complete={complete}
                sessionUsername={sessionUsername}
                ChatListUserContainer={ChatListUserContainer}
                messages={this.props.messages.messages}
                messagesRequesting={messagesRequesting}
                handleMessage={this.handleMessage}
                Bubble={Bubble}
                setValue={this.setValue}
                selectedId={this.props.selectedId}
                chatFocused={this.state.chatFocused}
                message={this.state.message}
                handleClick={this.handleClick}
                usersList={this.props.contactList}
                sessionId={this.props.sessionId}
                selectedUsername={this.props.selectedUsername}
                getHistory={this.getOldMessages}
                hasHistory={hasHistory}
                changeContact={this.changeContact}
              />
            : <DesktopMessages
                complete={complete}
                sessionUsername={sessionUsername}
                ChatListUserContainer={ChatListUserContainer}
                messages={this.props.messages.messages}
                messagesRequesting={messagesRequesting}
                handleMessage={this.handleMessage}
                Bubble={Bubble}
                setValue={this.setValue}
                selectedId={this.props.selectedId}
                chatFocused={this.state.chatFocused}
                message={this.state.message}
                handleClick={this.handleClick}
                usersList={this.props.contactList}
                sessionId={this.props.sessionId}
                selectedUsername={this.props.selectedUsername}
                getHistory={this.getOldMessages}
                hasHistory={hasHistory}
                changeContact={this.changeContact}
              />
          : null
        }
      </div>  
    )
  }
}

export default Wrapper(styles)(
  state => ({
    messages: state.messages,
    messagesRequesting: state.messages.getMessagesRequesting,
    userListReq: state.messages.storeContactListRequesting,
    contactList: state.messages.contactList,
    sessionId: state.session.id,
    sessionUsername: state.session.username,
    convs: state.messages.messages,
    complete: state.session.complete,
    currentOrder: state.home.searchCrit.currentOrder,
    stopGetHistory: state.messages.stopGetHistory,
    selectedId: state.messages.selectedId,
    selectedUsername: state.messages.selectedUsername,
    hasNewMsg: state.session.newMsg,
  }),
  {
    allowGetHistory: () => ({ type: 'ALLOW_GET_HISTORY'}),
    socketUpdate: (data) => ({ type: 'SOCKET_UPDATE', payload: data }),
    getContactList: () => ({type: 'STORE_CONTACT_LIST'}),
    getConv: (data) => ({ type: 'GET_MESSAGES', payload: data}),
    sendMessage: (data) => ({ type: 'SEND_MESSAGE', payload: data }),
    onMessage: () => ({ type: 'ON_MSG'}),
    onMessageSent: () => ({ type: 'ON_MSG_SENT'}),
    setAsSeen: (data) => ({ type: 'SET_SEEN', payload: data}),
    selectId: (data) => ({ type: 'SELECT_ID', payload: data})
  }
)(Messages)