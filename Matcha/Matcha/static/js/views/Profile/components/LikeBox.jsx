import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import Tooltip from '@material-ui/core/Tooltip'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { historyPush } from '../../../config/history'

const styles = (theme) => {
    return {
        ...style.profilPage,
        ...style.editionMode,
        unComplete: {
          border: '1px solid lightgrey',
          '& $likeBoxText': {
            color: 'lightgrey',
          },
          '& $heartIcon': {
            color: 'lightgrey',
          }
        },
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

class LikeBox extends React.Component {
  constructor(props){
    super(props)
    this.state={
    }
  }

  render() {
    const {classes, profile, enqueueSnackbar, sendDislike, sendLike, complete} = this.props
    return(
      <div className='fullWidth'>
        {!profile.self && <div
          className={`fullWidth flex column center alignCenter ${classes.likeBox} ${complete ? null : classes.unComplete}`}
          style={{margin: '20px 0px'}}
        >
          <div>
            <Tooltip title='liker' enterDelay={300}>
              {
                profile.liked
                  ? <Favorite
                    className={classes.heartIcon}
                    onClick={() => {
                      if (complete && !profile.blocked && !profile.blocks) {
                        sendDislike(profile.id)
                        enqueueSnackbar(`Vous avez déliké ${profile.username}`, { variant: 'success' })
                      }
                      if (complete && profile.blocked) {
                        enqueueSnackbar(`Veuillez débloquer ${profile.username} pour interagir.`, { variant: 'success' })
                      }
                    }}
                  />
                  : <FavoriteBorder
                    className={classes.heartIcon}
                    onClick={() => {
                      if (!profile.profilePic && !(profile.pics && profile.pics[0])) {
                        enqueueSnackbar(`${profile.username} ne peut pas recevoir vos hommages, dommage ! `, { variant: 'success' })
                      }
                      if (complete && !profile.blocked && !profile.blocks && (profile.profilePic || (profile.pics && profile.pics[0]))) {
                        sendLike({'id': profile.id, 'username': profile.username})
                        enqueueSnackbar(`Vous avez liké ${profile.username}`, { variant: 'success' })
                      }
                      if (complete && profile.blocked) {
                        enqueueSnackbar(`Veuillez débloquer ${profile.username} pour interagir.`, { variant: 'success' })
                      }
                    }}
                  />
              }
            </Tooltip>
          </div>
          <div className={`${classes.likeBoxText} center`} style={{fontSize: '18px'}}>
            {complete
              ? profile.blocked
                ? `Vous avez bloqué ${profile.username}` 
                : profile.blocks
                  ?  `Vous ne pouvez plus interagir avec ${profile.username}`
                  : profile.liked
                    ? `Vous avez liké ${profile.username}`
                    : `${profile.username} vous plaît?`
              : <div className={`flex center alignCenter`}>
                <div  style={{width: '80%'}}>
                  {`Oups, vous ne pouvez pas liker ${profile.username} tant que votre profil n'est pas complet`}
                  <span className={classes.profileLink} onClick={()=>{historyPush(`/profile/${this.props.sessionUsername}`)}}>
                    Remplir votre profil !
                  </span>
                </div>
              </div>
            }
          </div>
        </div>}
    </div>
    )
  }
}

export default Wrapper(styles)(
  (state)=>({
    profile: state.users,
    complete: state.session.complete,
    sessionUsername: state.session.username
  }),
  {
    sendLike: (data) => ({ type: 'SEND_LIKE', payload: data }),
    sendDislike: (data) => ({ type: 'SEND_DISLIKE', payload: data }),
  }
)(LikeBox)