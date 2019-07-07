import React from 'react'
import { style } from '../../../styles/styles.jsx'
import InputBase from '@material-ui/core/InputBase'
import { Scrollbars } from 'react-custom-scrollbars'
import Send from '@material-ui/icons/Send'
import isArray from 'lodash/isArray'
import Wrapper from "../../Wrapper"
import '../../../styles/animations/animations.css'
import BounceLoader from 'react-spinners/BounceLoader'
import { historyPush } from '../../../config/history'

const componentStyle = (theme) => {
	return {
		container: {
				...style.profilPage.container,
				backgroundColor: theme.palette.emptyContentColor,
				width: '100%'
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

const DesktopMessages = ({  classes, messages, selectedId,
    messagesRequesting, handleMessage, Bubble, ChatListUserContainer,
    setValue,chatFocused, message, handleClick, usersList, sessionId,
    selectedUsername, getHistory, hasHistory, complete, sessionUsername, changeContact }) => {
    
    const conv = messages[selectedId]
    return (
		<div
      className={`grid-12-noGutter flex fullHeight row alignCenter ${classes.container}`}
      style={{padding: 0}}
		>
            <div className={`col-2_sm-4 flex column fullHeight ${classes.chatListContainer}`}>
                <div className={`fullWidth flex alignCenter relative ${classes.chatListTitleLabel}`}>
                    Contacts
                </div>
                <Scrollbars
                    autoHide
                >
                  {
                    usersList && isArray(usersList) && usersList.map((user, index)=> 
                      <ChatListUserContainer
                        key={index}
                        selectedId={selectedId}
                        id={user.match_user_id}
                        name={user.username}
                        unread={user.msg_nb}
                        picture={user.img}
                        classes={classes}
                        setValue={setValue}
                        onClick={() => {
                          changeContact(user.match_user_id, user.username, user.msg_nb)
                          setValue('selectedUsername', user.username)
                        }}
                      />
                    )
                  }
                </Scrollbars>
                </div>
              <div className={`col-10_sm-8 flex column fullHeight`} style={{backgroundColor: '#ffebc4eb'}}>
                  <div
                    className={`fullWidth flex row alignCenter ${classes.chatTitle}`}
                  >
                  <span className={classes.titleContactName}>
                    {selectedUsername}
                  </span>
                  </div>
                  {
                    usersList && isArray(usersList) && usersList.length === 0
                      ? complete
                        ? <div
                            className={`flex fullWidth alignCenter center`}
                            style={{color: '#b3b3b3', fontSize: '30px', height: '100px'}}
                          >
                            <div>
                              Pour parler avec des gens, trouve des matchs. Pour paler seul, IRL.
                            </div>
                          </div>
                        : null
                      : selectedId !== 0
                        ? null
                        : <div
                          className={`flex fullWidth alignCenter center`}
                          style={{color: '#b3b3b3', fontSize: '30px', height: '100px'}}
                        >
                          <div>
                            Chargement
                          </div>
                        </div>
                  }
                  {complete
                  ? <Scrollbars
                    style={{ width: '100%', height: '100%' }}
                    autoHide
                    onUpdate={(scroll)=> {
                      if (scroll.top === 0 && hasHistory){
                        getHistory()
                      }
                    }}
                  >
                  <div className={'fullWidth flex center alignCenter'}>
                    <BounceLoader
                      sizeUnit={'px'}
                      size={40}
                      color={'#ff6c6c'}
                      loading={messagesRequesting}
                    />
                  </div>
                  <div style={{ width: '100%', height: '100%' }}>
                      {
                      conv && selectedId && Object.values(conv).map((message, index) => {
                        {return message.to_id === selectedId || message.from_id === selectedId
                          ?
                          <div key={index}>
                            <Bubble classes={classes} time={message.timestamp} user={message.from_id === sessionId} text={message.content} />
                          </div>
                          : null
                        }
                      })
                      }
                      <div id='scroll'/>
                  </div>
                  </Scrollbars>
                  : <div className={`fullHeight flex center alignCenter`}>
                    <div style={{fontSize: '20px', color: '#6c6c6c'}}>
                      Pour discuter avec vos Matchs vous devez compléter votre profil.
                      <span className={classes.profileLink} onClick={()=>{historyPush(`/profile/${sessionUsername}`)}}>
                        Accéder à mon profil
                      </span>
                    </div>
                  </div>}
          <div
            className={`fullWidth flex row alignCenter ${classes.chatTitle}`}
          >
            <div
              className={`fullWidth flex alignCenter spaceBetween 
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
                  inputProps={{maxLength: 1000}}
                  onKeyPress={(e) => { 
                    if (e.which === 13 && complete) {
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
                onClick={complete ? handleClick : null}
              />
            </div>
          </div>
      </div>
		</div>
    )
}

export default Wrapper(componentStyle)()(DesktopMessages)