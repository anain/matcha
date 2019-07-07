import React from 'react'
import Edit from '@material-ui/icons/Edit'
import Tooltip from '@material-ui/core/Tooltip'
import Wrapper from '../../Wrapper'
import CropperComp from '../../SetProfile/components/Cropper.jsx'

const styles = (theme) => {
	return {
		editIcon: {
			display: 'none',
			width: '50px',
			height: '50px',
			color: 'white',
			paddingTop: '7px',
			paddingRight: '7px'
		},
		editContainer: {
			position: 'relative',
			height: '200px',
			width: '200px',
			borderRadius: '100px',
			'&:hover': {
				cursor: 'pointer',
				'& $editIcon': {
					display: 'block'
				},
				'& $userPicture': {
					opacity: '0.8',
				}
			}
		},
		userPicture: {
			height: '200px',
			width: '200px',
			borderRadius: '100px'
		},
		iconContainer: {
			width: '100%',
			height: '100%',
			top: 0,
			left: 0
		},
		loadingContainer: {
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			zIndex: 100,
			backgroundColor: 'white',
			opacity: '0.5',
			borderRadius: '30px'
		}
	}
}

class ProfilePicture extends React.Component {
	constructor(props){
		super(props)
		this.openPicDialog=this.openPicDialog.bind(this)
		this.handleUploadImage=this.handleUploadImage.bind(this)
		this.changeState=this.changeState.bind(this)
		this.isValidPic=this.isValidPic.bind(this)
		this.ref=React.createRef()
		this.state={
			profilePicture: null,
			selection: null,
			cropperOpen: false,
			validPic: false
		}
	}

	isValidPic (picture) {
		let image = new Image()
		image.onload = function() {
			this.setState({validPic: true}, () => {
				if (this.props.mobile) {
					let formData = new FormData()
					formData.append('picture', picture, 'profile_pic')
					this.props.uploadPictures({formData: formData})
				} else this.setState({profilePicture: picture, cropperOpen: true})
		})}.bind(this)
		image.onerror = function() {
			alert('Image invalide.')
			this.setState({validPic: false})
		}.bind(this)
		image.src = URL.createObjectURL(picture)
	}

	openPicDialog () {
		this.ref.current.click()
	}

	handleUploadImage () {
		const pic = this.ref.current.files[0]
		this.isValidPic(pic)
	}

	changeState(key, value){
		this.setState({[key]: value})
	}

	render () {
		const {classes, editionMode, profilePicture, loading, mobile, selfProfile} = this.props

		return (
			<div className={`flex center alignCenter`}>
			<div className={`${editionMode ? classes.editContainer : null}`}>
				<input
					ref={this.ref}
					type="file"
					onClick={()=>{this.ref.current.value=''}}
					style={{display:"none"}}
					accept="image/png, image/jpeg"
					onChange={()=>{
						this.form.dispatchEvent(new Event("submit"))
					}}
				/>
				<img
					src={profilePicture}
					alt='User'
					className={`relative ${classes.userPicture}`}
					style={mobile && selfProfile ? {opacity: '0.6'} : null}
				/>
				{this.state.cropperOpen && !mobile
					?	<CropperComp
						cropperOpen={this.state.cropperOpen}
						pic={this.state.profilePicture}
						changeState={this.changeState}
						profile_pic
						picId={this.props.picId}
					/>
					: null
				}
				{editionMode
					? <form ref={(ref)=>{this.form = ref}} onSubmit={this.handleUploadImage}>
						<Tooltip title='Editer la photo' enterDelay={300}>
						<div
							className={`flex column alignCenter center absolute ${classes.iconContainer}`}
							onClick={this.openPicDialog}
						>
							<Edit
								className={`flex center alignCenter ${classes.editIcon}`}
								style={mobile ? {display: 'inline-block'} : null}
							/>
						</div>
						</Tooltip>
					</form>
					: null
				}
				{loading
					? <div
							className={`flex column alignCenter center absolute ${classes.loadingContainer}`}
							onClick={this.openPicDialog}
						/>
					: null
				}
			</div>
		</div>
		)
	}
}

export default Wrapper(styles)(
	(state)=>({
		selfProfile: state.users.self
	}),
	{
		uploadPictures:(data) => ({type: 'UPLOAD_PICTURE', payload:data})
	}
)(ProfilePicture)