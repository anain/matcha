import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import Map from './Map.jsx'
import 'leaflet/dist/leaflet.css'
import Edit from '@material-ui/icons/Edit'
import Checkbox from '@material-ui/core/Checkbox'
import { TextField } from '@material-ui/core'
import Button from '../../components/button'
import MyLocation from '@material-ui/icons/MyLocation'
import axios from 'axios'

const styles = (theme) => {
	return {
		...style.profilPage,
		...style.editionMode,
		noContentBox: {
			minHeight: '150px',
			padding: '20px 0px',
			borderRadius: '20px',
			backgroundColor: 'white',
			color: 'lightgrey',
			border: '1px solid lightgrey',
			marginBottom: '10px',
			textAlign: 'center',
		},
		editHover: {
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.textGreyColor,
			},
		},
		localisationBox: {
			color: theme.palette.textGreyColor,
			marginBottom: '10px',
			textAlign: 'center',
		}
	}
}

class GeolocDetails extends React.Component {
	constructor (props) {
		super(props)
		this.state={
			editDetails: false,
			detailsValue: this.props.selfProfile ? this.props.details : '',
			req: this.props.req,
			loading: false,
		}
	}

	componentDidUpdate(oldProps) {
		const newProps = this.props

		if (oldProps.session.geoloc !== newProps.session.geoloc) {
			axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${newProps.session.geoloc.location.postalCode}`).then((res)=>{
				this.setState({loading: false})
				this.props.editProfile({field: "geoloc_lat", new_value: res.data[0].lat})
				this.props.editProfile({field: "geoloc_long", new_value: res.data[0].lon})
				this.props.editProfile({field: "geoloc_city", new_value: newProps.session.geoloc.location.city})
				this.props.editProfile({field: "geoloc_postal_code", new_value: newProps.session.geoloc.location.postalCode})
			})
		}
		if (oldProps.profile.geoloc_city !== newProps.profile.geoloc_city) {
			axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${newProps.profile.geoloc_city}`).then((res)=>{
				if (res.data && res.data[0] && res.data[0].lat){
					this.props.editProfile({field: "geoloc_lat", new_value: res.data[0].lat})
					this.props.editProfile({field: "geoloc_long", new_value: res.data[0].lon})
				}
			})
		}
	}
		

	render () {
		const { classes, details, selfProfile, username, profile, mobile } = this.props
		const { editDetails, detailsValue } = this.state

		return (
			<div className={`fullWidth grid-12-noBottom-noGutter flex row spaceBetween`}>
			<div
				className={`col-12 flex column`}
				style={mobile ? {padding: '10px 0px'} : {padding: '20px 0px'}}
			>
				<span
					className={classes.resumeTextSection}
					style={{fontSize: '20px', fontWeight: '100', marginBottom: '5px', textAlign: 'center'}}
				>
					Détails
				</span>
				{selfProfile
					?	editDetails
							? <div className={`fullWidth flex column center alignCenter`}>
									<TextField
										placeholder='Ecrivez ce que vous voulez ici en 500 characteres...'
										value={detailsValue && detailsValue.length ? detailsValue : ''}
										variant="outlined"
										multiline
										rowsMax={10}
										rows={10}
										style={{
											padding: '10px',
											paddingLeft: '0px',
											width: '100%'
										}}
										onChange={(event) => { this.setState({detailsValue: event.target.value}) }}
										inputProps={{maxLength: 500}}
									/>
									<Button title='Enregistrer' onClick={() => {
											this.props.editProfile({field: 'long_desc', new_value: this.state.detailsValue})
											this.setState({
												editDetails: false
											})	
										}} 
										style={{height: '35px', width: '300px'}}
									/>
								</div>
							: <div
									className={`fullWidth flex column center alignCenter ${classes.noContentBox} ${classes.editHover}`}
									onClick={() => {this.setState({editDetails: true})}}
								>
									<Edit style={{width: '50px', height: '40px'}}/>
									{details && details.length
											? <span style={{width: '90%'}}>{details}</span>
											: 'Pas encore ajouté de détails, cliquez ici pour éditer'
									}
								</div>
					: details && details.length
							? <div
									className={`fullWidth flex column center alignCenter ${classes.noContentBox}`}
									style={{minHeight: '100px'}}
								>
									<span
										className={classes.resumeTextAnswer}
										style={{fontWeight: '100', fontSize: '17px', width: '90%'}}
									>
										{details}
									</span>
								</div>
							: <div className={`fullWidth flex column center alignCenter ${classes.noContentBox}`}>
									{`${username} n'a pas ajouté de détails.`}
								</div>
					}
			</div>
				{selfProfile
					? <div className={`flex alignCenter`} style={{padding: '15px 0px 20px 0px', color: '#6c6c6c'}}>
						<MyLocation
							style={{padding: '0px 3px', cursor: 'pointer'}}
						/>
						<Button
							title="Me geolocaliser"
							loading={this.state.loading}
							onClick={()=>{
								this.setState({loading: true})
								this.props.geoloc()
							}}
						/>
						<Checkbox
							style={{padding: '0px 5px 0px 5px', color: 'primary'}}
							checked={this.props.profile.geoloc_show}
							onChange={()=>{this.props.updateGeolocShow({new_value: !profile.geoloc_show})}}
						/>
						<span>Afficher la carte sur mon profil</span>
					</div>
				: <div style={{height: '30px'}}/>
				}
				<div className={`col-12 fullWidth`}>
				{(selfProfile && profile.geoloc_lat) || (profile.geoloc_show && profile.geoloc_lat) 
					? <div className='fullWidth' style={{borderRadius: '10px', overflow: 'hidden'}}>
						<Map markerPosition={{lat: profile.geoloc_lat, lng: profile.geoloc_long}} />
					</div>
					: <div className={`fullWidth flex center alignCenter ${classes.noContentBox}`}>
						{username} ne souhaite pas montrer sa position.
					</div>
				}
			</div>
		</div>
		)
	}
}

export default Wrapper(styles)(
	(state)=>({
		details: state.users.long_desc,
		selfProfile: state.users.self,
		username: state.users.username,
		geoloc: state.session.geoloc,
		req: state.users.editReq,
		profile: state.users,
		session: state.session
  }),
  {
		geoloc: () => ({type: 'GET_USER_GEOLOC'}),
    editProfile: (data) => ({type: 'EDIT_PROFILE', payload: data}),
    updateGeolocShow: (data) => ({type: 'UPDATE_GEOLOC', payload: data}),
  }
)(GeolocDetails)