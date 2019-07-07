import Wrapper from "../Wrapper"
import React from 'react'
import {style} from '../../styles/styles'
import Button from '../components/button'
import { TextField } from '@material-ui/core'
import Axios from "axios"
import Popup from '../Welcome/components/Popup.jsx'

const componentStyle = (theme) => {
	return {
		...style.profilPage,
		container: {
      ...style.profilPage.container,
      maxWidth: '800px',
      width: '100%',
      boxShadow: '1px 1px 1px 1px lightgrey',
      alignSelf: 'flex-start',
    },
	}
}

class Settings extends React.Component {
	constructor(props){
		super(props)
		this._isMounted = false
		this.checkPasswords=this.checkPasswords.bind(this)
		this.checkMail=this.checkMail.bind(this)
		this.isValidMail=this.isValidMail.bind(this)
		this.changeState=this.changeState.bind(this)
		this.isValidPassword=this.isValidPassword.bind(this)
		this.state={
			type: '',
			passwordInput: false,
			mailInput: false,
			oldPwd: '',
			newPwd: '',
			mail: '',
			popupOpen: false,
			passwordLoading: false,
			mailLoading: false,
			errorPwd: false,
			errorMail: false,
		}
	}

	isValidPassword (pwd) {
		const pass = /^.*(?=.{8,})((?=.*[!?@#$%^&*()/\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
		if (!(pass.test(pwd))) {
			return false
		}
		return true
	}

	isValidMail (mail) {
		const pass = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		if (!(pass.test(mail))) {
			return false
		}
		return true
	}

	checkMail(){
		const {mail} = this.state
		if (this._isMounted)this.setState({errorMail: false, type: 'mail'})
		if (this.isValidMail(mail)) {
			this.props.editMail({
				mail: mail
			})
		} else if (this._isMounted) {
			this.setState({errorMail: true})
		}
	}

	checkPasswords(){
		const {newPwd, oldPwd} = this.state
		if (this._isMounted) this.setState({errorPwd: false, type: 'pwd'})
		if (this.isValidPassword(newPwd) && oldPwd && (oldPwd !== newPwd)) {
			const data ={
				user_password: oldPwd,
				new_password: newPwd
			}
			this.props.changePassword(data)
		} else if (this._isMounted) {
			this.setState({errorPwd: true})
		}
	}

	componentDidMount () {
		this._isMounted = true
	}

	componentDidUpdate(oldProps){
		const newProps = this.props
		if (oldProps.success !== newProps.success && newProps.success && this._isMounted){
			this.setState({popupOpen: true})
		}
	}

	componentWillUnmount(){
		this._isMounted = false
	}

	changeState(key, value) {
		this.setState({[key]: value})
	}

	render() {
		const {classes, changePwdError, currentMail} = this.props
		const {passwordInput, popupOpen, mailInput, type, oldPwd, newPwd, mail, errorMail,passwordLoading, errorPwd} = this.state
		return (
			<div
				className={`flex row fullWidth center alignCenter fullHeight`}
				style={{...style, minHeight: '100%', overflowY: 'scroll'}}
			>
				{popupOpen
					? <Popup
						open={popupOpen}
						changeState={this.changeState}
						title={type === 'pwd' ? 'Mot de passe enregistré !' : 'Changement de mail'}
						description={type === 'pwd' ? null :`Valide ton nouveau mail en cliquant sur le lien qu'on t'a envoyé.`}
						onClose={()=>{this.setState({passwordInput: false})}}
					/>
					: null
				}
				<div
					className={`grid-12-noBottom-noGutter flex column alignCenter center relative ${classes.container}`}
				>
					<div className={`flex column center col-5_md-8_sm-12 alignCenter`}>
						{passwordInput
							? <div
									className={`flex column center alignCenter`}
									style={{marginTop: '15px'}}
								>
									<div style={{color: '#6c6c6c', fontWeight: '500'}}>
										Ancien mot de passe
									</div>
									<TextField
									placeholder='Ancien mot de passe'
									variant="outlined"
									type='password'
									error={errorPwd || changePwdError}
									style={{
										padding: '10px 0px',
										width: '200px'
									}}
									onChange={(event) => { this.setState({oldPwd: event.target.value}) }}
									inputProps={{maxLength: 15}}
								/>
								<div style={{color: '#6c6c6c', fontWeight: '500'}}>
									Nouveau mot de passe
								</div>
								<TextField
									type='password'
									placeholder='Nouveau mot de passe'
									variant="outlined"
									error={errorPwd || changePwdError}
									style={{
										padding: '10px 0px',
										width: '200px'
									}}
									onChange={(event) => { this.setState({newPwd: event.target.value}) }}
									inputProps={{maxLength: 15}}
								/>
								{errorPwd || changePwdError
									? <div style={{color: 'red', textAlign: 'center'}}>
											Les mots de passes sont identiques ou l'ancien mot de passe n'est pas correct ou le nouveau mot de passe ne contient pas 8 characteres minimum dont 1 majuscule 1chiffre et un charactere special.
										</div>
									: null
								}
							</div>
							: null
						}
						<Button
							title='Changer mon mot de passe'
							style={{margin: '20px 0px'}}
							loading={passwordLoading}
							onClick={
								passwordInput
								? ()=>{this.checkPasswords()}
								: ()=>{this.setState({passwordInput: true})}}
						/>
						{mailInput
							? <div 
									className={`flex column center alignCenter`}
									style={{marginTop: '15px'}}
								>
									<div style={{color: '#6c6c6c', fontWeight: '500'}}>
										{`Email actuel: ${currentMail}`}
									</div>
									<TextField
										placeholder='Nouveau mail'
										variant="outlined"
										error={errorMail}
										style={{
											padding: '10px 0px',
											width: '200px'
										}}
										onChange={(event) => { this.setState({mail: event.target.value}) }}
										inputProps={{maxLength: 100}}
									/>
								</div>
								: null
						}
						<Button
							title='Changer mon email'
							style={{margin: '20px 0px'}}
							onClick={mailInput
								? ()=>{this.checkMail()}
								: ()=>{this.setState({mailInput: true})}}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default Wrapper(componentStyle)(
	(state)=>({
		changePwdError: state.session.changePwdError,
		success: state.session.success,
		currentMail: state.session.mail
	}),
	{
    editMail: (data) => ({type: 'EDIT_MAIL', payload: data}),
		changePassword: (data)=>({type: 'CHANGE_PASSWORD_SETTINGS', payload: data}),
	}
)(Settings)