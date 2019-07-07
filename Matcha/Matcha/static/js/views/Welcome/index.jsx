import React, { Component } from 'react'
import Wrapper from '../Wrapper'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import MatchaLogo from '../components/matchaLogo.jsx'
import Button from '../components/button.jsx'
import welcomePicture from '../../styles/images/welcome.jpg'
import { style } from '../../styles/styles.jsx'
import { checkInputs } from './components/tools'
import { Tooltip } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import Popup from './components/Popup.jsx'
import { historyPush } from '../../config/history'
const styles = (theme) => {
  return {
		...style.welcomePage,
		link: {
			color: 'lightgrey',
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.primaryColor
			}
		}
  }
}

class Welcome extends Component {
  constructor (props) {
  super(props)
	this._isMounted=false
	this.changeState = this.changeState.bind(this)
	this.registerUser = this.registerUser.bind(this)
	this.loginUser = this.loginUser.bind(this)
	this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.state = {
		loading: false,
		popupOpen: false,
		width: 0,
		height: 0,
		selectedSection: 'login',
		loginPassword: '',
		registerPassword: '',
		confirmPassword: '',
		loginMail:'',
		registerMail:'',
		pseudo:'',
		wrongPass: false,
		wrongUsername: false,
		wrongName: false,
		wrongMail: false,
		nom: '',
		prenom: '',
		loginErr: this.props.loginErr
    }
  }

	componentDidUpdate(oldProps) {
		const newProps = this.props

		if (this._isMounted){
			if (oldProps.loginErr !== newProps.loginErr) {
				this.setState({loginErr: newProps.loginErr})
			}
			if (oldProps.registerReq !== newProps.registerReq && newProps.registerReq === false) {
				if (newProps.registerErr === false) {
					this.setState({
						popupOpen: true
					})
				}
				this.setState({
					loading: false,
				})
			}
			if (oldProps.registerErr !== newProps.registerErr && newProps.registerErr === true) {
				this.props.enqueueSnackbar(`Nous n'avons pas réussi à vous enregistrer, merci de réessayer plus tard.`, { variant: 'error' })
			}
		}
	}

	componentDidMount() {
		this._isMounted=true
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions)
	}
	
	componentWillUnmount() {
		this._isMounted=false
		window.removeEventListener('resize', this.updateWindowDimensions);
	}
	
	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	changeState (key, value) {
		this.setState({[key]: value})
	}

	registerUser () {
		const { registerMail, pseudo, registerPassword, confirmPassword, nom, prenom} = this.state
			if (checkInputs(nom, prenom, this.changeState, registerMail, pseudo, registerPassword, confirmPassword)) {
			const data = {
				mail: registerMail,
				username: pseudo,
				password: registerPassword,
				name: nom,
				first_name: prenom
			}	
			this.props.register(data)
		} else {
			this.setState({loading: false})
		}
	}

	loginUser () {
		const { loginMail, loginPassword } = this.state
		const data = {
			mail: loginMail,
      		password: loginPassword
		}
		this.props.login(data)
	}

  render () {
    const { classes } = this.props
		const { selectedSection, loginMail, registerMail, pseudo,
			 loginPassword, registerPassword, confirmPassword, wrongPass,
			wrongMail, wrongUsername, nom, prenom, wrongName, width } = this.state

		const fullSize = this.state.width > 1300
		const mobileSize = this.state.width < 500
		const login = selectedSection === 'login'
		return (
    	<div className={`fullHeight grid-12-noBottom-noGutter flex row center ${classes.container}`}>
				{fullSize &&
					<div
						className={`col-7_md flex center alignCenter`}
						style={{maxHeight: '100%', width: '50%'}}
					>
						<div
							className={`absolute ${classes.oval}`}
						/>
						<MatchaLogo
							style={{
								color: '#6f6d6d',
								padding: '15px',
								position: 'absolute',
								top: '0px',
								left: '0px',
								color: '#d45555',
							}}
						/>
						<div
							style={{
								width:'66%',
								height:'50%',
								zIndex: 7
							}}
						>
							<div
								className={classes.pictureText}
								style={this.state.width <= 1800 ? {fontSize: '50px'} : null}
							>
								Rencontrer la personne idéale?
							</div>
							<div
								className={classes.pictureSubtext}
								style={this.state.width <= 1800 ? {fontSize: '38px'} : null}
							>
								Matcha vous trouve votre âme soeur
							</div>
							<img
								src={welcomePicture}
								className={classes.picture}
								style={this.state.width <= 1500 ? {left: '-10%'} : null}
								alt=''
							/>
						</div>
					</div>
				}
				<div
					className={'col-5_md-12_sm-12 flex center'}
					style={mobileSize ? { height: '100%', alignItems: 'center', alignSelf: 'center' } : {alignItems: 'center', alignSelf: 'center'}}
				>
					<div
						className={`flex column ${classes.loginBox}`}
						style={this.state.width <= 800 ? {height: '100%', width: '100%', margin: 0, position: 'inherit', borderRadius: 0, alignSelf: 'center'} : null}
					>
						<Popup
              open={this.state.popupOpen}
              changeState={this.changeState}
              mobile={width <= 600}
              onClose={()=>{}}
							title='Mail envoyé !'
							description='Pour finir ton inscription, clique sur le lien que tu as reçu par mail.'
							highlight=" N'oublie pas de regarder dans les spams si tu ne le trouve pas ! "
							postscriptum="En cas d'erreur réinscris-toi"
            />
						<div className={`fullWidth fullHeight flex column`}>
							<div
								className={`flex row spaceBetween alignCenter ${classes.loginBoxNavbar}`}>
								<div
									className={`flex alignCenter center ${login ? classes.isSelected : classes.notSelected}`}
									onClick={() => {this.setState({selectedSection: 'login'})}}
								>
									Se connecter
								</div>
								<div
									className={`flex alignCenter center ${login ? classes.notSelected : classes.isSelected}`}
									onClick={() => {this.setState({selectedSection: 'register'})}}
								>
									Inscription
								</div>
							</div>
							<Divider />
							{login
								? <div className={`fullWidth fullHeight flex column alignCenter spaceAround`}>
									<div
										className={`fullWidth flex column center alignCenter`}
										style={{marginTop: '10%'}}
									>
										<MatchaLogo style={{color: '#6f6d6d', padding: '10px'}}/>
										<TextField
											placeholder='Votre email'
											name='email'
											value={loginMail || ''}
											variant="outlined"
											inputProps={{maxLength: 100}}
											error={this.state.loginErr}
											style={{
												padding: '20px',
												width: '65%'
											}}
											onChange={(event) => { this.changeState('loginMail', event.target.value) } }
										/>
										<TextField
											placeholder='Votre mot de passe'
											error={this.state.loginErr}
											name='mdp'
											inputProps={{maxLength: 100}}
											value={loginPassword || ''}
											variant="outlined"
											type='password'
											style={{
												padding: '20px',
												width: '65%'
											}}
											onChange={(event) => { this.changeState('loginPassword', event.target.value) } }
										/>
										<div className={classes.link} style={mobileSize ? {textAlign: 'center'} : null}>
											{this.state.loginErr &&
												<span style={{color: 'red'}}>
													Email ou mot de passe invalide. 
												</span>
											}
											<div
												onClick={()=>{historyPush('/resetpassword-mail')}}
											>
												Mot de passe oublié?
											</div>
										</div>
									</div>
									<Button title='Connexion' empty style={{width: '80%', maxWidth: '500px'}} onClick={this.loginUser}/>
								</div>
								: <div className={`fullWidth fullHeight flex column alignCenter`}>
								<div
									className={`fullWidth flex column`}
									style={{padding: '35px', width: '80%'}}
								>
									<div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
										Pseudonyme
										{wrongUsername && !mobileSize
										? <div style={{color: 'red', fontSize: '15px', paddingLeft: '9px'}}>
											Au moins 4 charactères
										</div>
										: null
										}
									</div>
									<TextField
										name='pseudo'
										value={pseudo || ''}
										error={wrongUsername}
										placeholder='Choisissez un pseudo'
										inputProps={{maxLength: 60}}
										variant="outlined"
										style={{
											padding: '20px 0px',
											width: '100%'
										}}
										onChange={(event) => { this.changeState('pseudo', event.target.value) } }
									/>
									<div className={`fullWidth flex row alignCenter`}>
										<div className={`fullWidth flex column alignCenter`}>
											<div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
												Nom
												{wrongName && !mobileSize
													? <div style={{color: 'red', fontSize: '15px', paddingLeft: '9px'}}>
														Au moins 2 charactères
													</div>
													: null
												}
											</div>
											<TextField
												name='Nom'
												value={nom || ''}
												placeholder='Nom'
												error={wrongName}
												variant="outlined"
												style={{
													padding: '20px',
													width: '100%'
												}}
												inputProps={{maxLength: 60}}
												onChange={(event) => { this.changeState('nom', event.target.value) } }
											/>
										</div>
										<div className={`fullWidth flex column alignCenter`}>
											<div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
												Prénom
											</div>
											<TextField
												name='Prénom'
												error={wrongName}
												value={prenom || ''}
												placeholder='Prénom'
												inputProps={{maxLength: 60}}
												variant="outlined"
												style={{
													padding: '20px',
													width: '100%'
												}}
												onChange={(event) => { this.changeState('prenom', event.target.value) } }
											/>
										</div>
									</div>
									 <div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
										Email
										{wrongMail && !mobileSize
											? <div style={{color: 'red', fontSize: '15px', paddingLeft: '9px'}}>
												Email invalide
											</div>
											: null
										}
									</div>
									<TextField
										name='email2'
										value={registerMail || ''}
										placeholder='Votre email'
										inputProps={{maxLength: 100}}
										variant="outlined"
										error={wrongMail}
										style={{
											padding: '20px 0px',
											width: '100%'
										}}
										onChange={(event) => { this.changeState('registerMail', event.target.value) } }
									/>
									<div className={`fullWidth flex row alignCenter`}>
										<div className={`fullWidth flex column alignCenter`}>
											<div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
												Mot de passe
											</div>
											<TextField
												name='mdp2'
												value={registerPassword || ''}
												inputProps={{maxLength: 15}}
												placeholder='Votre mot de passe'
												variant="outlined"
												error={wrongPass}
												type="password"
												style={{
													padding: '20px',
													width: '100%'
												}}
												onChange={(event) => { this.changeState('registerPassword', event.target.value) } }
											/>
										</div>
										<div className={`fullWidth flex column alignCenter`}>
											<div className={`fullWidth flex row alignCenter ${classes.inputLabel}`}>
												Confirmation
												{wrongPass && !mobileSize
													? <Tooltip title={'Vos mots de passes sont-ils identiques? Rappel: Votre mot de passe doit contenir au moins 8 charactères dont au moins une majuscule, 1 chiffre et 1 charactere spécial.'}>
														<div style={{color: 'red', fontSize: '15px', paddingLeft: '9px'}}>
															Mdp invalides
														</div>
													</Tooltip>
													: null
												}
											</div>
											<TextField
												name='confirmPassword'
												value={confirmPassword || ''}
												placeholder='Confirmez votre mot de passe'
												inputProps={{maxLength: 15}}
												variant="outlined"
												error={wrongPass}
												type="password"
												style={{
													padding: '20px',
													width: '100%'
												}}
												onChange={(event) => { this.changeState('confirmPassword', event.target.value) } }
											/>
										</div>
									</div>
								</div>
								<Button
									title="S'inscrire"
									loading={this.state.loading}
									empty
									style={{width: '80%', maxWidth: '500px'}}
									onClick={()=>{
										this.setState({loading: true})
										this.registerUser()
									}}/>
							</div>
							}
						</div>
					</div>
				</div>
    	</div>
    )
  }
}

export default withSnackbar(Wrapper(styles)(
  state=>({
		state: state,
		userId: state.session.id,
		loginErr: state.session.loginErr,
		registerErr: state.session.registerErr,
		registerReq: state.session.registerUserRequesting
	}),
	{
		register: (data) => ({type: 'REGISTER_USER', payload: data}),
		login: (data) => ({type: 'LOGIN_USER', payload: data})	
	}
	)(Welcome))