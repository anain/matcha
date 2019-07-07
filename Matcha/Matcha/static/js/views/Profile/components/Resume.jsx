import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import Edit from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import { Checkbox } from '@material-ui/core'
import MyLocation from '@material-ui/icons/MyLocation'
import Tooltip from '@material-ui/core/Tooltip'
import axios from 'axios'

const styles = (theme) => {
	return {
		...style.profilPage,
		...style.editionMode,
		editIco: {
			display: 'none',
		},
		editHover: {
			'&:hover': {
				'& span': {
					color: 'white'
				},
			'& $editIco': {
				display: 'inline-block',
			},
			backgroundColor: 'lightgrey',
			color: 'white',
			cursor: 'pointer',
			borderRadius: '10px'
			}
		},
		ico: {
			heigth: '25px',
			width: '25px'
		},
		checkbox: {
			padding: '0px 10px'
		}
	}
}

class Resume extends React.Component {
	constructor(props){
		super(props)
		this.resetInputs=this.resetInputs.bind(this)
		this.checkAge=this.checkAge.bind(this)
		this.state={
			ageEdit: false,
			genderEdit: false,
			orientationEdit: false,
			cityEdit: false,
			jobEdit: false,
			ageInput: '',
			ageInputError: false,
			cityInput: '',
			jobInput: ''
		}
	}

	resetInputs() {
		this.setState({
			ageEdit: false,
			genderEdit: false,
			orientationEdit: false,
			cityEdit: false,
			jobEdit: false,
		})
	}

	checkAge() {
		const { ageInput } = this.state
		const mom = moment(ageInput, "DD-MM-YYYY")
		const age = moment().diff(mom, 'years')
		if (ageInput.length === 0){
			this.resetInputs()
		}
		if (mom === 'Invalid date' || mom.format('YYYY-MM-DD') === 'Invalid date' || ageInput.length < 10 || (age < 18 || age > 200)) {
			this.setState({ageInputError: true})
			return
		}

		this.props.editProfile({field: 'birth_date', new_value: mom.format('YYYY-MM-DD')})
		this.setState({ageInputError: false})
		this.resetInputs()
	}

	render(){
		const { classes, profile, mobile } = this.props
		const { ageInput } = this.state
		const getInfo = (info) => {
			if (info === null) return 'non renseigné'
			return info
		}
		let city = getInfo(profile.geoloc_city)
		let job = getInfo(profile.profession)
		return(
			<div className={`grid-12 fullWidth flex row spaceBetween ${classes.resume}`}>
				{this.state.ageEdit
					? <div className='flex alignCenter'>
							<TextField
								placeholder='JJ/MM/AAAA'
								error={this.state.ageInputError}
								variant="outlined"
								style={{
									height: '40px'
								}}
								value={ageInput}
								onChange={(event) => {
									this.setState({ageInput: event.target.value})
								}}
								inputProps={{maxLength: 10}}
							/>
							<button
								onClick={()=>{
									this.checkAge()
								}}
								style={{height: 'minContent', marginLeft: '5px'}}
							>
								Ok
							</button>
						</div>
					: <div
							className={`${profile.self ? classes.editHover : null}
							${classes.resumeSection} col-6_sm-12 flex row`}
							onClick={()=>{
								if (profile.self){
									this.resetInputs()
									this.setState({ageEdit: true})
								}
							}}
						>
						<div className={`flex alignCenter spaceAround`} style={{height: '25px'}}>
							<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Age: </span>
							<span className={`${classes.resumeTextAnswer}`}>{getInfo(profile.age)}</span>
							<div
								className={classes.editIco}
								style={mobile && profile.self ? {display: 'inline-block', color: 'lightgrey'} : null}
							>
								<Edit className={classes.ico}/>
							</div>
						</div>
					</div>
			}
			{this.state.genderEdit
					? <div className='flex alignCenter' style={{width: '50%'}}>
						<Checkbox
							checked={profile.gender === 'M'}
							classes={{root: classes.checkbox}}
							onChange={()=>{
								if (profile.gender === 'F'){
									this.props.editProfile({field: 'gender', new_value: 'M'})
								} else {
									this.props.editProfile({field: 'gender', new_value: 'F'})
								}
							}}
						/> M
						<Checkbox
							checked={profile.gender === 'F'}
							classes={{root: classes.checkbox}}
							onChange={()=>{
								if (profile.gender === 'M'){
									this.props.editProfile({field: 'gender', new_value: 'F'})
								} else {
									this.props.editProfile({field: 'gender', new_value: 'M'})
								}
							}}
						/> F
						<button
							style={{marginLeft: '5px'}}
							onClick={()=>{
								this.setState({ genderEdit: false })
							}}
						>
							Ok
						</button>
					</div>
					: <div
					className={`${profile.self ? classes.editHover : null}
					${classes.resumeSection} col-6_sm-12 flex row`}
					onClick={()=>{
						if (profile.self) {
							this.resetInputs()
							this.setState({genderEdit: true})
						}
					}}
				>
					<div className={`flex alignCenter`} style={{height: '25px'}}>
						<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Genre: </span>
						<span className={`${classes.resumeTextAnswer}`}>{getInfo(profile.gender)}</span>
						<div
							className={classes.editIco}
							style={mobile && profile.self ? {display: 'inline-block', color: 'lightgrey'} : null}
						>
							<Edit className={classes.ico}/>
						</div>
					</div>
				</div>
			}
			{this.state.orientationEdit
				? <div className='flex alignCenter' style={{width: '50%'}}>
						<Checkbox
							checked={profile.sex_orientation === 'M' || profile.sex_orientation === 'MF'}
							classes={{root: classes.checkbox}}
							onChange={()=>{
								// this.props.editProfile({field: 'sex_orientation', new_value: 'M'})
								// this.setState({ orientationEdit: false })
								if (profile.sex_orientation === 'F'){
									this.props.editProfile({field: 'sex_orientation', new_value: 'MF'})
								} else if (profile.sex_orientation === 'MF'){
									this.props.editProfile({field: 'sex_orientation', new_value: 'F'})
								} else {
									this.props.editProfile({field: 'sex_orientation', new_value: 'M'})
								}
							}}
						/> M
						<Checkbox
							checked={profile.sex_orientation === 'F' || profile.sex_orientation === 'MF'}
							classes={{root: classes.checkbox}}
							onChange={()=>{
								// this.props.editProfile({field: 'sex_orientation', new_value: 'F'})
								// this.setState({ orientationEdit: false })
								if (profile.sex_orientation === 'M'){
									this.props.editProfile({field: 'sex_orientation', new_value: 'MF'})
								} else if (profile.sex_orientation === 'MF'){
									this.props.editProfile({field: 'sex_orientation', new_value: 'M'})
								} else {
									this.props.editProfile({field: 'sex_orientation', new_value: 'F'})
								}
							}}
						/> F
						<button
							style={{marginLeft: '5px'}}
							onClick={()=>{
								// if (this.state.cityInput.length && this.state.cityInput !== profile.geoloc_city){
								// 	this.props.editProfile({field: 'geoloc_city', new_value: this.state.cityInput})
								// }
								this.setState({ orientationEdit: false })
							}}
						>
							Ok
						</button>
					</div>
				: <div
					className={`${profile.self ? classes.editHover : null} ${classes.resumeSection} col-6_sm-12 flex row`}
					onClick={()=>{
						if (profile.self) {
							this.resetInputs()
							this.setState({orientationEdit: true})
						}
					}}
				>
					<div className={`flex alignCenter`} style={{height: '25px'}}>
						<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Recherche: </span>
						<span className={`${classes.resumeTextAnswer}`}>{getInfo(profile.sex_orientation)}</span>
						<div
							className={classes.editIco}
							style={mobile && profile.self ? {display: 'inline-block', color: 'lightgrey'} : null}
						>
							<Edit className={classes.ico}/>
						</div>
					</div>
				</div>
			}
				{this.state.cityEdit
					? <div className='flex alignCenter' style={{width: '50%'}}>
							<div className={`flex alignCenter`}>
							<TextField
								placeholder='Entrez une ville'
								variant="outlined"
								style={{
									height: '40px'
								}}
								value={this.state.cityInput}
								onChange={(event) => {
									this.setState({ cityInput: event.target.value })
								}}
								inputProps={{maxLength: 60}}
							/>
							<button
								style={{marginLeft: '5px'}}
								onClick={()=>{
									if (this.state.cityInput.length && this.state.cityInput !== profile.geoloc_city){
										this.props.editProfile({field: 'geoloc_city', new_value: this.state.cityInput})
									}
									this.setState({cityEdit: false})
								}}
							>
								Ok
							</button>
						</div>
					</div>
					: <div
							className={`${profile.self ? classes.editHover : null} ${classes.resumeSection} col-6_sm-12 flex row`}
							onClick={()=>{
								if (profile.self) {
									this.resetInputs()
									this.setState({cityEdit: true})
								}
							}}
						>
							<div className={`flex alignCenter`} style={{height: '25px'}}>
								<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Ville: </span>
								<span className={`${classes.resumeTextAnswer}`}>{city.length > 22 ? city.slice(0, 22) + '...' : city}</span>
								<div
									className={classes.editIco}
									style={mobile && profile.self ? {display: 'inline-block', color: 'lightgrey'} : null}
								>
									<Edit className={classes.ico}/>
								</div>
							</div>
						</div>
					}
				{this.state.jobEdit
						? <div className='flex' style={{width: '50%'}}>
								<TextField
									placeholder='CTO....'
									variant="outlined"
									style={{
										height: '40px'
									}}
									value={this.state.jobInput}
									onChange={(event) => {
										this.setState({ jobInput: event.target.value })
									}}
									inputProps={{maxLength: 60}}
								/>
								<button
									onClick={()=>{
										this.props.editProfile({field: 'profession', new_value: this.state.jobInput})
										this.setState({jobEdit: false})
									}}
								>
									Ok
								</button>
							</div>
						: <div
						className={`${profile.self ? classes.editHover : null} ${classes.resumeSection} col-6_sm-12 flex row`}
						onClick={()=>{
							if (profile.self) {
								this.resetInputs()
								this.setState({jobEdit: true})
							}
						}}
					>
						<div className={`flex alignCenter`} style={{height: '25px'}}>
							<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Profession: </span>
							<span className={`${classes.resumeTextAnswer}`}>{job.length > `${mobile ? 15 : 22}` ? job.slice(0, `${mobile ? 15 : 22}`) + '...' : job}</span>
							<div
								className={classes.editIco}
								style={mobile && profile.self ? {display: 'inline-block', color: 'lightgrey'} : null}
							>
								<Edit className={classes.ico}/>
							</div>
						</div>
					</div>
				}
				<div className={`${classes.resumeSection} col-6_sm-12 flex row`}>
					<span className={classes.resumeTextSection} style={mobile && profile.self ? {color: 'grey'} : null}>Dernière Connexion: </span>
					<span className={`${classes.resumeTextAnswer}`}>{getInfo(profile.last_connection)}</span>
				</div>
			</div>
		)
	}
}

export default Wrapper(styles)(
	(state)=>({
		profile: state.users,
	}),
	{
    editProfile: (data) => ({type: 'EDIT_PROFILE', payload: data}),
    updateGeolocShow: (data) => ({type: 'UPDATE_GEOLOC', payload: data}),
	}
)(Resume)