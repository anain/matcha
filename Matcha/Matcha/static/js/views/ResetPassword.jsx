import React from 'react'
import Wrapper from './Wrapper'
import Button from './components/button'
import MatchaLogo from './components/matchaLogo.jsx'
import { historyPush } from '../config/history'
import TextField from '@material-ui/core/TextField'
import Popup from './Welcome/components/Popup.jsx'

const componentStyle = (theme) => {
	return {
		container: {
			borderRadius: '15px',
			backgroundColor: 'white',
			width: '100%',
			height: '100%',
			maxHeight: '500px',
			maxWidth: '500px',
			boxShadow: '10px 5px 5px lightgrey'
		},
		background: {
			backgroundColor: theme.palette.emptyContentColor
		},
		errmsg: {
			fontSize: '20px',
			color: theme.palette.textGreyColor,
			width: '80%',
			textAlign: 'center',
		}
	}
}

class ResetPassword extends React.Component {
	constructor (props) {
		super(props)
		this.changeState=this.changeState.bind(this)
		this.submit = this.submit.bind(this)
		this.isValidPassword = this.isValidPassword.bind(this)
		this.state={
			newPassword: '',
			confirmNew: '',
			error: false,
			loading: false,
			popupOpen: false
		}
	}

	changeState(key, value) {
		this.setState({[key]: value})
	}

	componentDidUpdate(oldProps){
		const newProps = this.props
		if (oldProps.success !== newProps.success && newProps.success === true){
			this.setState({loading: false, popupOpen: true})
		}
	}

	isValidPassword (pwd, confirm) {
		const pass = /^.*(?=.{8,})((?=.*[!?@#$%^&*()/\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

		if (pwd !== confirm || !(pass.test(pwd))) {
			this.setState({error: true, loading: false})
			return false
		}
		return true
	}

	submit () {
		const token = this.props.location.pathname.split('/')[2]

		if (token && this.isValidPassword(this.state.newPassword, this.state.confirmNew)){
			const data = {
				token: token,
				password: this.state.newPassword
			}
			this.props.validateResetPassword(data)
		}
	}

	render () {
		const { classes } = this.props

		return (
			<div className={`fullWidth fullHeight flex center alignCenter ${classes.background}`}>
				<div className={`flex column center alignCenter ${classes.container}`}>
					<Popup
						open={this.state.popupOpen}
						onClose={()=>{
							historyPush('/welcome')
						}}
						changeState={this.changeState}
						title='Mot de passe modifié !'
						description='Vous pouvez désormais vous connecter avec votre nouveau mot de passe.'
					/>
					<MatchaLogo style={{color: '#6f6d6d', padding: '10px'}}/>
					<div className={classes.errmsg}>
						{'Changement de mot de passe'}
					</div>
					<TextField
						placeholder='Nouveau mot de passe'
						name='ancientPassword'
						value={this.state.newPassword || ''}
						type='password'
						variant="outlined"
						error={this.state.error}
						style={{
							padding: '20px',
							width: '65%'
						}}
						inputProps={{maxLength: 15}}
						onChange={(event) => { this.setState({newPassword: event.target.value}) } }
					/>
					<TextField
						placeholder='Confirmation'
						name='ancientPassword'
						value={this.state.confirmNew || ''}
						type='password'
						variant="outlined"
						error={this.state.error}
						inputProps={{maxLength: 15}}
						style={{
							padding: '20px',
							width: '65%'
						}}
						onChange={(event) => { this.setState({confirmNew: event.target.value}) } }
					/>
					{this.state.error
						? <div>Les mots de passes ne sont pas identiques ou invalides</div>
						: null
					}
					<Button
						style={{width: '80%', position: 'relative', top: '45px'}}
						title="Confirmer"
						empty
						loading={this.state.loading}
						onClick={() => {
							this.setState({error: false, loading: true})
							this.submit()
						}}
					/>
				</div>
			</div>
		)
	}
}

export default Wrapper(componentStyle)(
	(state)=>({
		success: state.session.success
	}),
	{
		validateResetPassword: (data) => ({type: 'VALID_RESET_PWD', payload: data})
	}
)(ResetPassword)