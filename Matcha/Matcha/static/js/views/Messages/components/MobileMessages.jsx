import React from 'react'
import { style } from '../../../styles/styles.jsx'
import InputBase from '@material-ui/core/InputBase'
import { Scrollbars } from 'react-custom-scrollbars'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Send from '@material-ui/icons/Send'
import Wrapper from "../../Wrapper"
import isArray from 'lodash/isArray'
import '../../../styles/animations/animations.css'
import BounceLoader from 'react-spinners/BounceLoader'
import { historyPush } from '../../../config/history'

const componentStyle = (theme) => {
	return {
      container: {
          ...style.profilPage.container,
          backgroundColor: theme.palette.emptyContentColor,
          width: '100%',
          margin: 0
        },
      ...style.messages,
      profileLink: {
        paddingLeft: '5px',
        color: theme.palette.primaryColor,
        cursor: 'pointer',
        '&:hover': {
          color: theme.palette.primaryHoverColor
        }
      } 
	}
}

class MobileMessages extends React.Component {
  constructor (props) {
    super(props)
    this.state={
      userSelected: false
    }
  }

  render () {
    const { classes, messages,
      messagesRequesting, handleMessage, Bubble, ChatListUserContainer,
      setValue, selectedId, chatFocused, message, handleClick, usersList, sessionId,
      selectedUsername, complete, sessionUsername, hasHistory, getHistory, changeContact} = this.props

    const { userSelected } = this.state

    const conv = messages[selectedId]
    return (
      <div
        className={`fullWidth fullHeight flex row alignCenter ${classes.container}`}
        style={{padding: '0px'}}
		  >
          {userSelected
            ? <div className={`fullWidth flex column fullHeight`}>
                <div
                  className={`fullWidth fullHeight flex row alignCenter ${classes.chatTitle}`}
                >
                  <ArrowBackIos
                    style={{color: '#6c6c6c', fontSize: '25px', marginLeft: '10px'}}
                    onClick={() => {
                      setValue('userSelected', false)
                      this.setState({userSelected: false})
                    }}
                  />
                  <span
                    style={{color: '#6c6c6c', fontSize: '15px'}}
                    onClick={() => {
                      setValue('userSelected', false)
                      this.setState({userSelected: false})
                    }}
                  >
                      Retour 
                  </span>
                  <span className={classes.titleContactName}>
                    {selectedUsername}
                  </span>
                </div>
                <Scrollbars
                  style={{ width: '100%', height: '100%'}}
                  autoHide
                  onUpdate={(scroll)=> {
                    if (scroll.top === 0 && hasHistory){
                      getHistory()
                    }
                  }}
                >
                  <div className={'fullWidth flex center alignCenter'} style={{marginTop: '20px'}}>
                      <BounceLoader
                          sizeUnit={'px'}
                          size={40}
                          color={'#ff6c6c'}
                          loading={messagesRequesting}
                      />
                  </div>
                  <div style={{ width: '100%', height: '100%' }}>
                      {
                      conv && Object.values(conv).map((message, index) => {
                        {return message.to_id === selectedId || message.from_id === selectedId
                          ?
                          <div key={index}>
                            <Bubble
                              classes={classes}
                              time={message.timestamp}
                              user={message.from_id === sessionId}
                              text={message.content}
                            />
                        </div>
                        : null
                        }
                      })
                      }
                      <div id='scroll'/>
                  </div>
                </Scrollbars>
                <div
                  className={`fullWidth flex row  fullHeight alignCenter ${classes.chatTitle}`}
                >
                  <div
                    className={`fullWidth flex alignCenter fullHeight spaceBetween 
                    ${classes.writeAnswerContainer}
                    ${chatFocused ? classes.borderPrimary : classes.borderSecondary}`}
                  >
                    <div  className={``} style={{width: '90%'}}>
                      <InputBase
                        className={`fullWidth ${classes.answerLabel}`}
                        placeholder="Répondre"
                        multiline
                        rowsMax="2"
                        value={message}
                        onFocus={() => { setValue( 'chatFocused', true ) }} 
                        onBlur={() => { setValue( 'chatFocused', false ) }}
                        onChange={(event) => { handleMessage(event.target.value) }}
                        onKeyPress={(e) => { 
                          if (e.which === 13) {
                            handleClick()
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <Send
                      className={`${classes.sendIcon} ${chatFocused
                        ? classes.sendPrimary
                        : classes.sendSecondary}`
                      }
                      onClick={handleClick}
                    />
                  </div>
                </div>
              </div>
            : <div className={`fullWidth flex column fullHeight ${classes.chatListContainer}`}>
                {complete
                  ? <div className={`fullHeight`}>
                  <div className={`fullWidth flex alignCenter ${classes.chatListTitleLabel}`}>
                    <span style={{paddingLeft: '20px'}}>Contacts</span>
                  </div>
                  {
                    !usersList || !usersList.length
                      ? <div className={`fullWidth flex center`}>
                          <div style={{width: '85%', color: 'salmon'}}>Votre liste de contact est vide. Matchez avec un utilisateur pour pouvoir parler avec lui!</div>
                        </div>
                      : null
                  }
                  <Scrollbars
                    autoHide
                    style={{margin: 0}}
                  >
                    {
                      usersList && isArray(usersList) && usersList.map((user, index)=>     
                          <div key={index}>
                            <ChatListUserContainer
                              mobile
                              selectedId={selectedId}
                              id={user.match_user_id}
                              name={user.username}
                              picture={user.img}
                              classes={classes}
                              onClick={() => {
                                changeContact(user.match_user_id, user.username, user.msg_nb)
                                setValue('selectedUsername', user.username)
                                setValue('userSelected', true)
                                this.setState({userSelected: true})
                              }}
                          />
                          {
                            selectedId === user.match_user_id &&
                            <div id='mobileUserSelected'/>
                          }
                        </div>
                      )
                    }
                  </Scrollbars>
                </div>
              : <div className={`fullHeight flex center alignCenter`}>
                <div style={{fontSize: '20px', color: '#6c6c6c', width: '90%', textAlign: 'center'}}>
                Pour discuter avec vos Matchs vous devez completer votre profil.
                <span className={classes.profileLink} onClick={()=>{historyPush(`/profile/${sessionUsername}`)}}>
                  Accéder à mon profil
                </span>
              </div>
            </div>}
          </div>
        }
		</div>
    )
  }
}

export default Wrapper(componentStyle)(
  (state) => ({
    sessionId: state.session.id
  })
)(MobileMessages)
