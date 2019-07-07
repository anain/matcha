import React, { Component } from 'react'
import { style } from '../../styles/styles.jsx'
import Wrapper from '../Wrapper'
import Info from '@material-ui/icons/Info'
import Tags from '../components/tags'
import UserPhotos from './components/UserPhotos'
import BounceLoader from 'react-spinners/BounceLoader'
import { subscribeSocket, unSubscribeSocket } from './components/SubscribeSocket'
import ReportDialog from './components/ReportDialog'
import CompleteProfileDialog from './components/CompleteProfileDialog'
import Resume from './components/Resume'
import UsernamePhotoBio from './components/UsernamePhotoBio'
import LikeBox from './components/LikeBox'
import GeolocDetails from './components/GeolocDetails'

const styles = (theme) => {
  return {
    ...style.profilPage,
    ...style.editionMode,
    container: {
      ...style.profilPage.container,
      maxWidth: '800px',
      width: '100%',
      boxShadow: '1px 1px 1px 1px lightgrey',
      alignSelf: 'flex-start',
    },
    popUp: {
      div: '10px',
      span: '5px',
      input: {
        width: '100%'
      }
    },
    instructions: {
      padding: '0px 0px 20px 0px',
      fontSize: '18px',
      color: theme.palette.placeHolderColor
    }
  }
}

class Profile extends Component {
  constructor (props) {
    super(props)
		this._isMounted = false
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.changeState = this.changeState.bind(this)
    this.moveMarker = this.moveMarker.bind(this)
    this.ref = React.createRef()
    this.state = {
      id: this.props.id,
      online: this.props.profile.online,
      lastCon: this.props.profile.last_connection,
      width: 0,
      height: 0,
      blocks: false,
      popUpOpen: false,
      openPhoto: false,
      selectedPhoto: '',
      showDialog: true,
      unMount: false
    }
  }

  moveMarker = () => {
    const { lat, lng } = this.state.markerPosition
    this.setState({
      markerPosition: {
        lat: lat + 0.0001,
        lng: lng + 0.0001, 
      }
    })
  }

	componentDidMount() {
    this._isMounted = true
    const urlUsername = this.props.location.pathname.split('/')[2]
    this.props.getProfile(urlUsername)
		this.updateWindowDimensions()
    document.addEventListener('mousedown', this.handleClick, false)
    window.addEventListener('resize', this.updateWindowDimensions)
	}

  componentDidUpdate(oldProps) {
    const newProps = this.props

    if (this._isMounted && oldProps.profile.last_connection !== newProps.profile.last_connection && newProps.profile.id){
      this.setState({online: newProps.profile.online, lastCon: newProps.profile.last_connection})
      this.props.sendView(newProps.profile.id)
      subscribeSocket(newProps.id, (data) => this.setState({online: data.online, lastCon: data.lastCon}))
    }
  }

	updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
	}

  componentWillUnmount() {
    unSubscribeSocket(this.props.id)
    window.removeEventListener('resize', this.updateWindowDimensions);
    document.removeEventListener('mousedown', this.handleClick, false)
    this._isMounted = false
  }

  changeState (key, value) {
    this.setState({[key]: value})
  }

  render () {
    const { classes, style, complete, profile, profileRequesting } = this.props
    const { id, width, popUpOpen, showDialog } = this.state

    return (
      <div
        className={`flex row fullWidth center alignCenter fullHeight`}
        style={this.state.openPhoto ? {...style, minHeight: '100%'} : {...style, minHeight: '100%', overflowY: 'scroll'}}
        id='topPage'
      >
        {this.state.openPhoto
          ? <div
              className={`absolute flex center alignCenter ${classes.openPhotoContainer}`}
              ref={this.ref}
              onClick={() => {this._isMounted && this.setState({openPhoto: false}) }}
            >
              <img
                src={'data:image/jpeg;base64,' + this.state.selectedPhoto}
                alt=''
                ref={node => this.node = node}
                style={{zIndex: '20', maxWidth: '90%', maxHeight: '90%'}}
              />
            </div>
          : null
        }
        {this.props.id && !profileRequesting
        ? <div
            className={`flex column alignCenter relative ${classes.container}`}
          >
            {
              profile.self
                ? <div className={`fullWidth flex center alignCenter ${classes.instructions}`}>
                    <Info style={{paddingRight: '10px', width: '30px', height: '30px'}}/> Pour modifier vos informations, cliquez sur le champ afin de l'éditer.
                  </div>
                : null
            }
            <UsernamePhotoBio
              id={id}
              width={width}
              changeState={this.changeState}
              mobile={width <= 600}
              online={this.state.online}
              lastCon={this.state.lastCon}
            />
            <ReportDialog
              open={popUpOpen}
              changeState={this.changeState}
              mobile={width <= 600}
            />
            <CompleteProfileDialog
              open={profile.self && !complete && showDialog && !profileRequesting}
              changeState={this.changeState}
              mobile={width <= 600}
            />
            <Resume
              mobile={width <= 600}
            />
            <div className={`fullWidth flex row alignCenter`}>
              <Tags
                mobile={width <= 600}
              />
            </div>
            <LikeBox /> 
            <UserPhotos
              mobile={width <= 600}
              changeState={this.changeState}
            />
            
            <GeolocDetails
              mobile={width <= 600}
            />
          </div>
        : <div
            className={'fullWidth flex center alignCenter'}
            style={{marginTop: '20px'}}
          >
          <BounceLoader
            sizeUnit={'px'}
            size={40}
            color={'#ff6c6c'}
            loading={true}
          />
        </div>
      }
      </div>
    )
  }
}

export default Wrapper(styles)(
  state=>({
    id: state.users.id,
    state: state,
    profile: state.users,
    profileRequesting: state.users.getProfileRequesting,
    profileConnectionStatus: state.interactions.online,
    complete: state.session.complete,
  }),
  {
    getProfile: (username) => ({type: 'GET_PROFILE', payload: username}),
    changeStatus: () => ({type: 'CONNECTION_STATUS_UPDATE'}),
    sendView: (data) => ({ type: 'SEND_VIEW', payload: data }),
  }
)(Profile)
