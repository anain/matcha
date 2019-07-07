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

class ResetPasswordMail extends React.Component {
	constructor (props) {
		super(props)
		this.changeState=this.changeState.bind(this)
		this.state={
			email: '',
			popupOpen: false
		}
	}

	changeState(key, value) {
		this.setState({[key]: value})
	}

	componentDidUpdate(oldProps){
		const newProps = this.props
		if (oldProps.success !== newProps.success && newProps.success === true){
			this.setState({popupOpen: true})
		}
	}

	render () {
		const { classes } = this.props

		return (
			<div className={`fullWidth fullHeight flex center alignCenter ${classes.background}`}>
				<Popup
					open={this.state.popupOpen}
					changeState={this.changeState}
					title='Mail envoyé !'
					description='Pour pouvoir changer ton mot de passe, clique sur le lien que tu as reçu par mail.'
					highlight=" N'oublie pas de regarder dans les spams si tu ne le trouve pas ! "
					postscriptum="En cas d'erreur redemande un mail"
				/>
				<div className={`flex column center alignCenter ${classes.container}`}>
					<MatchaLogo style={{color: '#6f6d6d', padding: '10px'}}/>
					<div className={classes.errmsg}>
						{'Saisissez votre email'}
					</div>
					<TextField
						placeholder='votre-email@reset.fr'
						name='ancientPassword'
						value={this.state.email || ''}
						type='text'
						variant="outlined"
						style={{
							padding: '20px',
							width: '65%'
						}}
						inputProps={{maxLength: 100}}
						onChange={(event) => { this.setState({email: event.target.value}) } }
					/>
					<Button
						style={{width: '80%', position: 'relative', top: '45px'}}
						title="Confirmer"
						empty
						onClick={() => {
							this.props.resetPassword({mail: this.state.email})
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
		resetPassword: (data) => ({type: 'RESET_PWD', payload: data}),
	}
)(ResetPasswordMail)