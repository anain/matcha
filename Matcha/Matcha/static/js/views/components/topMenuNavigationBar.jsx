import Wrapper from "../Wrapper"
import React from 'react'
import MatchaLogo from './matchaLogo'
import MailOutline from '@material-ui/icons/MailOutline'
import Search from '@material-ui/icons/Search'
import Notifications from '@material-ui/icons/Notifications'
import Tooltip from '@material-ui/core/Tooltip'
import { historyPush } from '../../config/history'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import {style} from '../../styles/styles'
import { getMsgNotif } from './subscribeSocket'
import { subscribeNotifications } from './subscribeNotifications'
import { subscribePopUps } from './subscribePopUps'
import isArray from 'lodash/isArray'
import Badge from '@material-ui/core/Badge'
import { withSnackbar } from 'notistack'
import { Divider } from "@material-ui/core"

const componentStyle = () => {
	return {
		...style.navBar,
		badge: {
			marginTop: '8px',
			marginRight: '8px'
		},
		menuItemRoot: {
			width: '100%',
			padding: '17px 0px'
		}
	}
}

const options = [
  'Voir mon profil',
  'Paramètres',
  'Deconnexion'
]

const ITEM_HEIGHT = 48

class topMenuNavigationBar extends React.Component {
	constructor (props) {
		super(props)
		subscribeNotifications(() => {
      		this.props.updateNotifications()
		})
		getMsgNotif((data) => {
			this.props.incrementNotif(data)
		})
		subscribePopUps((contact) => {
			this.props.enqueueSnackbar(`Vous avez un match avec ${contact} !`, { variant: 'success' })
		})
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.state = {
			selectedPage: '',
			msgBadge: 0,
			width: 0,
			height: 0,
			navbarMenuAnchor: null,
			notificationsAnchor: null,
			newMsg: this.props.newMsg,
			notifications : [],
			newNot: 0
		}
	}

	componentDidUpdate(oldProps) {
		const newProps = this.props
		if (oldProps.newNot !== newProps.newNot) {
			this.setState({
				newNot: newProps.newNot
			})
		}
		if (oldProps.notifications !== newProps.notifications) {
			this.setState({
					notifications: this.props.notifications
				})
			}
		if (oldProps.profilePic !== newProps.profilePic) {
			this.setState({
				profilePicture: newProps.profilePic,
				username: newProps.username
			})
		};
		if (oldProps.newMsg !== newProps.newMsg) {
			this.setState({
				newMsg: newProps.newMsg,
			})
		}
		if (oldProps.session.geoloc !== newProps.session.geoloc && this.props.session.geoloc_empty) {
			this.props.editProfile({field: "geoloc_lat", new_value: newProps.session.geoloc.location.lat})
			this.props.editProfile({field: "geoloc_long", new_value: newProps.session.geoloc.location.lng})
		}
	}

	componentDidMount() {
		const section = this.props.location.pathname.split('/')[1]
		this.setState({selectedPage: section})
		if (!this.props.session.geoloc){
			this.props.geoloc({self: true})
		}
		if (!this.props.sessionId){
			this.props.getPicture()
		}
		if (this.props.profilePic) this.setState({
			profilePicture: this.props.profilePic,
			username: this.props.username
		})
		this.props.getNotificationsCount()
		if (this.props.newNot){
		 	this.setState({
				newNot: this.props.newNot
			})
		}

		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	
	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

  handleClose = (key) => {
		this.setState({
			navbarMenuAnchor: null,
			notificationsAnchor: null
		})
		if (typeof key === 'number'){
			if (key === 0) {
				historyPush(`/profile/${this.props.username}`)
			} else if (key === 1) {
				historyPush(`/settings`)
			} else if (key === 2) {
				this.props.userLogout()
			}
		} else if (typeof key === 'string'){
				historyPush(`/profile/${key}`)
		}
  }

	handleClick = (event, name) => {
		name === 'Menu'
			? this.setState({ navbarMenuAnchor: event.currentTarget })
			: this.setState({ notificationsAnchor: event.currentTarget })
		name == 'Notifications' && this.props.getNotifications()
  };

  render () {
		const { classes, sessionId, notifications, profilePicture, profile } = this.props
		const { navbarMenuAnchor, notificationsAnchor, newNot } = this.state
		const open = Boolean(navbarMenuAnchor)
		const notificationsOpen = Boolean(notificationsAnchor)
		const picture = profilePicture
			?  `data:image/jpeg;base64,${profilePicture}`
			: 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'
    return (
			<div>
				<div
					className={`fullWidth flex alignCenter spaceBetween ${classes.container}`}
					style={this.state.width < 900 ? {justifyContent: 'center'} : null}
				>
			{this.state.width >= 900
				? <div className={``} onClick={() => {
					sessionId
						? historyPush('/home')
						: historyPush('/welcome')
					}}>
					<MatchaLogo
						style={{paddingLeft: '20px'}}
					/>
				</div>
				: null
			}
				<div className={`flex`}>
					<Tooltip title='Trouver un match' enterDelay={400} leaveDelay={200}>
						<Search
							className={classes.iconStyle}
							style={this.state.selectedPage === 'home' ? {color: '#d45555'} : null}
							onClick={() => { historyPush('/home') }}
						/>
					</Tooltip>
					
					<Tooltip title='Messages' enterDelay={400} leaveDelay={200}>
						<Badge
							badgeContent={this.state.newMsg}
							color="secondary"
							max={99}
							invisible={!this.state.newMsg}
							classes={{badge: classes.badge}}
						>
							<MailOutline
								className={classes.iconStyle}
								style={this.state.selectedPage === 'messages' ? {color: '#d45555'} : null}
								onClick={() => { historyPush('/messages') }}
							/>
						</Badge>
					</Tooltip>
					<Tooltip title='Notifications' enterDelay={150} leaveDelay={200}>
					<div>
						<Badge 
							badgeContent={newNot}
							color="secondary"
							max={99}
							invisible={!newNot}
							classes={{badge: classes.badge}}
						>
							<Notifications
								className={classes.iconStyle}	
								onClick={(event) => { this.handleClick(event, 'Notifications') }}
							/>
						</Badge>
					</div>
					</Tooltip>
					<Menu
						id="notifications"
						open={notificationsOpen}
						anchorEl={notificationsAnchor}
						onClose={this.handleClose}
						PaperProps={{
							style: {
								width: 250,
								maxHeight: 300
							},
						}}
						classes={{
							paper: classes.paper
						}}
					>
						{isArray(notifications) && notifications.length === 0 &&
							<div className={`fullWidth flex center alignCenter ${classes.emptyNotif}`} >
								Vous n'avez pas de notification.
							</div>
						}
						{notifications && notifications.map((notification, index) => (
							<div key={index}>
							<MenuItem
								disableGutters
								onClick={() => {
									this.handleClose(notification.username)
								}}
								style={{whiteSpace: 'normal', height: '60px'}}
								classes={{
									root: classes.menuItemRoot
								}}
							>
								<div className={`fullWidth grid-12-noBottom-noGutter flex row center alignCenter spaceAround`}>
									<div className={`col-4 flex center alignCenter`}>
										<img
											src= {notification.img ? `data:image/jpeg;base64,${notification.img}`
												 : 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'}				
											alt=''
											style={{width: '50px', height: '50px', borderRadius: '50px'}}
										/>
									</div>
									<div className={`col-8 flex row`}>
											<span style={{wordBreak: 'break-word', width: '100%', color: 'grey', padding: '10px'}}>
												{notification.text}
											</span>
									</div>
								</div>
							</MenuItem>
							<Divider style={{width: '100%'}}/>
							</div>
					))}
					</Menu>
					<Tooltip title='Profil' enterDelay={400} leaveDelay={200}>
						<div
							className={`flex center alignCenter ${classes.iconPicture}`}
							style={this.state.selectedPage === 'profile' && profile.self ? {backgroundColor: '#d45555'} : null}
						>
							<img
								src={picture}
								alt=''
								className={classes.pictureStyle}
								onClick={(event) => { this.handleClick(event, 'Menu') }}
								aria-label="More"
								aria-owns={open ? 'navmenu' : undefined}
								aria-haspopup="true"
							/>
						</div>
					</Tooltip>
					<Menu
							id="navmenu"
							open={open}
							anchorEl={navbarMenuAnchor}
							onClose={this.handleClose}
							PaperProps={{
								style: {
									maxHeight: ITEM_HEIGHT * 4.5,
									width: 200
								},
							}}
							classes={{
								paper: classes.paper
							}}
						>
							{options.map((option, index) => (
								<MenuItem style={{padding: '15px 15px'}} key={option} onClick={() => { this.handleClose(index) }} classes={{root: classes.menuItemRoot}}>
									{option}
								</MenuItem>
							))}
						</Menu>
				</div>
			</div>
		</div>
    )
  }
}

export default  withSnackbar(Wrapper(componentStyle)(
	state=>({
		profile: state.users,
		state: state,
		profilePicture: state.session.profilePicture,
		username: state.session.username,
		sessionId: state.session.id,
		newNot: state.session.newNot,
		notifications: state.session.notifications,
		newMsg: state.session.newMsg,
		session: state.session
	}),
	{
    selectId: (data) => ({ type: 'SELECT_ID', payload: data}),
		getPicture: () => ({type: 'GET_PICTURE'}),
		incrementNotif: (data) => ({type: 'ADD_MSG_NOTIF', payload: data}),
		userLogout: () => ({type: 'LOGOUT_USER'}),
		getNotifications: () => ({type: 'GET_NOTIFICATIONS'}),
		geoloc: (data) => ({type: 'GET_USER_GEOLOC', data: data}),
		editProfile: (data) => ({type: 'EDIT_PROFILE', payload: data}),
		updateNotifications: () => ({type: 'NOTIF_SOCKET_UPDATE_SUCESS'}),
		getNotificationsCount: () =>  ({type: 'GET_NOTIFICATION_COUNT'}),
	}
	)(topMenuNavigationBar))