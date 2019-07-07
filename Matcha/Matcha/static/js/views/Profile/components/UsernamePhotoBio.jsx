import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import ProfilePicture from './ProfilePicture'
import Tooltip from '@material-ui/core/Tooltip'
import Stars from '@material-ui/icons/Stars'
import MoreVert from '@material-ui/icons/MoreVert'
import Button from '../../components/button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Edit from '@material-ui/icons/Edit'

const styles = (theme) => {
	return {
		...style.profilPage,
    ...style.editionMode,
    usernamePhotoBioContainer: {
      marginBottom: '20px'
    },
    titleName: {
      fontSize: '25px',
      fontWeight: '500',
      color: '#373636',
      cursor: 'pointer'
    }
	}
}

class UsernamePhotoBio extends React.Component {
  constructor(props) {
    super(props)
    this.changeState=this.changeState.bind(this)
    this.state={
      profilePic: this.props.infos.profilePicture,
      selfProfilePic: this.props.selfProfilePicture,
      moreOpen: false,
      self: this.props.infos.self,
      bioEdit: false,
      username: this.props.username,
      score: this.props.infos.score,
      anchorEl: null,
      blocked: this.props.infos.blocked,
      bioEditValue: this.props.infos.short_desc,
      nameEdit: false,
      firstnameEditValue: this.props.infos.first_name,
      lastnameEditValue: this.props.infos.name,
    }
  }

  componentDidUpdate(oldProps){
    const newProps = this.props

    if (oldProps.selfProfilePicture !== newProps.selfProfilePicture){
      this.setState({selfProfilePic: newProps.selfProfilePicture})
    }
    if (oldProps.profilePicture !== newProps.profilePicture){
      this.setState({profilePic: newProps.profilePicture})
    }
  }

  changeState (key, value) {
    this.setState({[key]: value})
  }

  render () {
    const { classes, width, id, sendBlock, unBlock, editProfile, short_desc, self, changeState,
       mobile, enqueueSnackbar, lastCon, online, blocks, blocked  } = this.props
    const { moreOpen, bioEdit, username, score,
        anchorEl, bioEditValue, nameEdit, firstnameEditValue, lastnameEditValue } = this.state

    const info = this.props.infos
		const noPicture = 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'
    return (
      <div
        className={`fullWidth flex row ${classes.usernamePhotoBioContainer}`}
        style={width <= 900
          ? {justifyContent: 'center', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}
          : null
        }>
          <div>
            <ProfilePicture
              loading={this.props.req}
              editionMode={self}
              profilePicture={
                info.self
                ? this.props.selfProfilePicture
                  ? `data:image/jpeg;base64,${this.props.selfProfilePicture}`
                  : noPicture
                : info.profilePicture
                  ? `data:image/jpeg;base64,${info.profilePicture}`
                  : noPicture
              }
              loading={this.props.req}
              picId={this.props.picId}
              mobile={width <= 900}
            />
          <div>
          </div>
        </div>
          <div
            className={`flex column center`}
            style={width <= 800
              ? {width: '80%', alignItems: 'center', alignContent: 'center'}
              : {width: '50%', paddingLeft: '25px'}}
            >
            <div
              className={`${classes.title} ${classes.titleName}`}
              style={nameEdit
                ? null
                : self
                  ? {'&:hover': {backgroundColor: 'lightgrey', width: 'fit-content', borderRadius: '10px', cursor: 'pointer'}}
                  : {cursor: 'initial'}
              }
              onClick={()=>{nameEdit ? ()=>{} : self ? this.setState({nameEdit: true}) : null}}
            >
              {nameEdit
                ? <div className={`flex row alignCenter`}>
                    <TextField
                      placeholder='Prénom'
                      variant="outlined"
                      value={firstnameEditValue}
                      style={{
                        padding: '10px',
                        paddingLeft: '0px',
                        maxWidth: '300px',
                        width: '100%'
                      }}
                      onChange={(event) => {
                        this.setState({firstnameEditValue: event.target.value.replace(/\s/g,'')})
                      }}
                      inputProps={{maxLength: 60}}
                    />
                    <TextField
                      placeholder='Nom'
                      variant="outlined"
                      value={lastnameEditValue}
                      style={{
                        padding: '10px',
                        paddingLeft: '0px',
                        maxWidth: '300px',
                        width: '100%'
                      }}
                      onChange={(event) => {
                        this.setState({lastnameEditValue: event.target.value.replace(/\s/g,'')})
                      }}
                      inputProps={{maxLength: 60}}
                    />
                    <Button
                      title='Enregistrer'
                      onClick={() => {
                        if (firstnameEditValue.length >= 1 && lastnameEditValue.length >= 1){
                          editProfile({field: 'first_name', new_value: firstnameEditValue})
                          editProfile({field: 'name', new_value: lastnameEditValue})
                        } else {
                          alert(`Merci d'entrer au moins un caractère pour le nom et pour le prénom.`)
                        }
                        this.setState({
                          nameEdit: false
                        })
                      }}
                    style={{height: '35px', width: '300px'}}
                  />
                  </div>
                : <div>
                    {`${info.first_name} ${info.name}`}
                  </div>
              }
            </div>
            <div
              className={`fullWidth flex row alignCenter`}
              style={mobile ? {flexDirection: 'column', marginTop: '10px', marginLeft: '0px', width: 'max-content'} : {marginLeft: '0px', width: 'max-content'}}
            >
              <div className={classes.title} style={{fontSize: '21px'}}>
                {info.username}
              </div>
              {blocks || blocked ? ''
                : online === true 
                  ? <div className={`flex alignCenter`} style={mobile ? {width: '59%', paddingBottom: '10px'} : null}>
                    <FiberManualRecord style={{color: '#8ACB88'}}/>
                    <span style={{color: 'grey'}}>En ligne</span>
                  </div>
                  : <div className={`flex alignCenter`} style={mobile ? {width: '59%', paddingBottom: '10px'} : null}>
                    <FiberManualRecord style={{color: 'red'}}/>
                    <span style={{color: 'grey'}}>Dernière connexion : {lastCon}</span>
                  </div>
              }
            </div>
            <div
              className={`${classes.subtitle} ${self ? classes.editText : null}`}
              style={{minHeight: bioEdit === true ? '0px' : mobile ? '0px' : '100px', overflowWrap: 'break-word'}}
              onClick={self
                ? () => {this.setState({bioEdit: true})}
                : null
            }
            >
              {bioEdit
                ? ''
                : <div style={{paddingTop: '5px'}}>
                  {
                    short_desc
                    ? short_desc
                    : `${self ? 'Vous n\'avez' : `${info.username} n'a`}
                    pas encore de bio${self ? `, cliquez ici pour vous présenter en 2 lignes !` : '.'}`
                  }
                  <div className={classes.editIco}>
                    <Edit className={classes.ico} style={mobile ? {display: 'inline-block', color: 'lightgrey'} : null}/>
                  </div>
                </div>
              }
            </div>
            {
              bioEdit === true
              ? <div>
                <TextField
                  placeholder='Présentez vous en 2 lignes'
                  variant="outlined"
                  multiline
                  rowsMax={2}
                  style={{
                    padding: '10px',
                    paddingLeft: '0px',
                    maxWidth: '300px',
                    width: '100%'
                  }}
                  onChange={(event) => {
                    this.setState({bioEditValue: event.target.value})
                  }}
                  inputProps={{maxLength: 149}}
                />
                <Button
                  title='Enregistrer'
                  onClick={() => {
                    editProfile({field: 'short_desc', new_value: bioEditValue})
                    this.setState({
                      bioEdit: false
                    })
                  }}
                  style={{height: '35px', width: '300px'}}
                />
              </div>
              : null
            }
          </div>
          <div
            className={`flex spaceBetween`}
            style={width <= 800
              ? null
              : {position: 'relative', left: '10%'
            }}
          >
            <div className={`flex`}>
              <Tooltip title='Popularity' enterDelay={300}>
                <Stars className={classes.starIcon} />
              </Tooltip>
              <div
                className={classes.nbStarLabel}
                style={width <= 800 ? {fontSize: '20px'} : null}
              >
                {score}
              </div>
            </div>
            <div>
              {self === false && width > 800
                ? <div><Tooltip title='Options' enterDelay={300}>
                  <MoreVert
                    className={classes.moreIcon}
                    onClick={(event) => {
                      this.setState({
                        moreOpen: !moreOpen,
                        anchorEl: event.currentTarget
                      })
                    }}
                    aria-label="More"
                    aria-owns={moreOpen ? 'long-menu' : undefined}
                    aria-haspopup="true"
                  />
                </Tooltip>
                <Menu
                  open={moreOpen}
                  onClick={() => {
                    this.setState({
                      moreOpen: !moreOpen,
                      anchorEl: null
                    })
                  }}
                  id="long-menu"
                  anchorEl={anchorEl}
                  PaperProps={{
                    style: {
                      width: 200,
                    },
                  }}
                >
                <MenuItem  onClick={() => {
                  this.setState({
                    moreOpen: !moreOpen,
                  })
                  changeState('popUpOpen', true)
                }}
                >
                  Signaler
                </MenuItem>
                  <MenuItem onClick={() => {
                    blocked ? unBlock(id) : sendBlock(id)
                    enqueueSnackbar(`Vous avez ${blocked ? 'débloqué' : 'bloqué'} ${username}`, { variant: 'info' })
                    this.setState({
                      moreOpen: !moreOpen,
                      blocked: !blocked
                    })
                  }}
                  >
                    {blocked ? 'Débloquer' : 'Bloquer'}
                </MenuItem>
              </Menu>
              </div>
              :null
              }
            </div>
          </div>
      </div>
    )
  }
}

export default Wrapper(styles)(
  state=>({
    infos: state.users,
    short_desc: state.users.short_desc,
    selfProfilePicture: state.session.profilePicture,
    picId: state.session.picId,
    req: state.session.uploadPictureRequesting,
    username: state.users.username,
    id: state.users.id,
    self: state.users.self,
    blocked: state.users.blocked,
    blocks: state.users.blocks,
  }),
  {
    editProfile: (data) => ({type: 'EDIT_PROFILE', payload: data}),
    sendBlock: (data) => ({ type: 'SEND_BLOCK', payload: data }),
    unBlock: (data) => ({ type: 'SEND_UNBLOCK', payload: data }),
  }
)(UsernamePhotoBio)