import React from 'react'
import { style } from '../../../styles/styles.jsx'
import Wrapper from '../../Wrapper'
import AddAPhoto from '@material-ui/icons/AddAPhoto'
import Edit from '@material-ui/icons/Edit'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'

const styles = (theme) => {
	return {
        ...style.profilPage,
        photosContainer: {
            position: 'relative'
				},
				noPhotoBox: {
					height: '200px',
					borderRadius: '20px',
					backgroundColor: 'white',
					color: 'lightgrey',
					border: '1px solid lightgrey',
					marginBottom: '10px',
					textAlign: 'center',
				},
				editHover: {
					border: '1px solid lightgrey',
					borderRadius: '20px',
					overflow: 'hidden',
					position: 'relative',
					'& $pictureBox': {
						opacity: '0.5'
					},
					'& $photoico': {
						opacity: '0.5'
					},
					cursor: 'pointer',
					'&:hover': {
						'& $editPhotoHover': {
							opacity: '0.7'
						},
						color: theme.palette.textGreyColor,
					},
				},
				showHover: {
					border: '1px solid lightgrey',
					borderRadius: '20px',
					overflow: 'hidden',
					position: 'relative',
					cursor: 'pointer',
				},
				editPhotoHover: {
					opacity: '0.5',
					cursor: 'pointer',
				},
				photoico: {
					width: '50px',
					height: '40px',
					position: 'absolute',
					zIndex: 10,
					color: 'lightgrey',
				},
				editIco: {
					width: '45px',
					height: '45px',
					color: 'white',
					zIndex: 10,
					position: 'relative',
					paddingTop: '7px',
					paddingRight: '7px',
					display: 'none'
				},
				iconContainer: {
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
				},
				pictureBox: {
					height: '200px',
					border: '1px solid lightgrey',
					'&:hover': {
						opacity: '0.6',
						'& $editIco': {
							display: 'block'
						}
					}
				},
				addPhotoBox: {
					height: '200px',
					border: '1px solid lightgrey',
					'&:hover': {
						'& $photoico': {
							color: 'black'
						}
					}
				},
				userPic: {
					height: '200px',
					width: '100%'
				}
	}
}

class UserPhotos extends React.Component {
	constructor(props){
		super(props)
		this.openPicDialog=this.openPicDialog.bind(this)
		this.handleUploadImage=this.handleUploadImage.bind(this)
    this.handleClick = this.handleClick.bind(this)
		this.openPhoto = this.openPhoto.bind(this)
    this.scrollToPhotos = this.scrollToPhotos.bind(this)
    this.inputRef = React.createRef()
		this.state={
			openEdit: false,
			photos: null,
			photoHover: false,
			tmpIdHover: null,
			index: null, 
		}
	}

  handleClick = (e) => {
    if (this.node && this.node.contains(e.target)) {
      return
    }
    this.setState({openPhoto: false})
  }

  scrollToPhotos () {
    document.getElementById('topPage').scrollTop = 0
  }

	openPhoto (photo) {
		this.props.changeState('openPhoto', true)
		this.props.changeState('selectedPhoto', photo.img)
  }

	openPicDialog () {
			this.inputRef.current.click()
	}

	handleUploadImage (id, index) {
		const {profile} = this.props
		let image = new Image()
		image.onload = function() {
				let formData = new FormData()
				formData.append('picture', this.inputRef.current.files[0], 'picture')
				id !== null && formData.append('id', id)
				this.props.uploadPictures({formData: formData, index: id ? index : Object.keys(profile.pics).length})
		}.bind(this)
		image.onerror = function() {
			alert('Image invalide.')
		}.bind(this)
		image.src = URL.createObjectURL(this.inputRef.current.files[0])
	}

	render(){
		const {classes, profile, mobile, session} = this.props
		return (
		<div className={`fullWidth`}>
				<div
					className={`fullWidth`}
					style={profile.pics && Object.keys(profile.pics).length ? {overflowX: 'auto', borderRadius: '10px'} : {borderRadius: '10px'}}
				>
					<div
						className={`fullWidth flex row relative ${Object.keys(profile.pics).length ? classes.photosContainer : null}`}
					>
						{profile.self
								? <div className={`fullWidth flex column center spaceAround `}>
											<form
												ref={(ref)=>{this.form = ref}}
												onSubmit={()=>{this.handleUploadImage(this.state.tmpIdHover, this.state.index)}}
												className={`grid-12-noBottom-noGutter fullWidth flex ${classes.editHover}`}
											>
											{Object.values(profile.pics).map((photo, index) => {
												if (!photo.profile_pic)
												{return <div
													key={index}
													onClick={()=>{this.setState({tmpIdHover: photo.id, index: index})}}
													className={`${classes.pictureBox} col-3_sm-6  relative`}
												>
													<input
														ref={this.inputRef}
														type="file"
														style={{display:"none"}}
														accept="image/png, image/jpeg"
														onClick={()=>{this.inputRef.current.value=''}}
														onChange={()=>{
															this.form.dispatchEvent(new Event("submit"))
														}}
													/>
													{photo &&
														<img
															className={`relative ${classes.userPic}`}
															src={`data:image/jpeg;base64,${photo.img}`}
															style={{width: '100%', height: '100%'}}
														/>
													}
													<div
														className={`flex column alignCenter center absolute ${classes.iconContainer}`}
														onClick={this.openPicDialog}
													>
														<Edit
															className={`flex center alignCenter ${classes.editIco}`}
															style={mobile && profile.self ? {display: 'inline-block'} : null}
														/>
													</div>
												</div>}
											}
										)}
											{(Object.values(profile.pics).length < 4 && !session.profilePicture) || (Object.values(profile.pics).length < 5 && session.profilePicture) 
												?	<div
														className={`col-3_sm-6 flex center alignCenter ${classes.addPhotoBox}`}
														onClick={()=>{this.setState({tmpIdHover: null, index: null}, this.openPicDialog())}}
													>
														<input
															ref={this.inputRef}
															type="file"
															style={{display:"none"}}
															accept="image/png, image/jpeg"
															onChange={()=>{
																this.form.dispatchEvent(new Event("submit"))
															}}
														/>
														<AddAPhoto
															className={classes.photoico}
														/>
												</div>
												: null
											}
											</form>
									</div>
								: <div className={`fullWidth flex column center spaceAround `}>
										{Object.values(profile.pics).length !== 0
												? <div
												className={`grid-12-noBottom-noGutter fullWidth flex ${classes.showHover}`}
												style={{height: '200px'}}
											>
												{Object.values(profile.pics).map((photo, index) => {
													if (!photo.profile_pic){
														return <div
															key={index}
															onClick={()=>{mobile ? null : this.scrollToPhotos(); this.openPhoto(photo)}}
															className={`${classes.pictureBox} col-3_sm-6 relative`}
															style={{'&:hover':{opacity: 0.9}}}
														>
															{photo &&
																<img
																	className={`relative ${classes.userPic}`}
																	src={`data:image/jpeg;base64,${photo.img}`}
																	style={{width: '100%', height: '100%'}}
																/>
															}
															<div
																className={`flex column alignCenter center absolute ${classes.iconContainer}`}
															>
																<RemoveRedEye className={`flex center alignCenter ${classes.editIco}`} />
															</div>
														</div>}
													})}
											</div>
											: <div
												className={`grid-12-noBottom-noGutter fullWidth flex center alignCenter ${classes.showHover}`}
												style={{height: '200px', cursor: 'none', color: 'lightgrey'}}
											>
												{`${profile.username} n'a pas encore ajouté de photos`}
											</div>}
									</div>
								}
							</div>
				</div>
			</div>
		)
	}
}

export default Wrapper(styles)(
	(state)=>({
		profile: state.users,
		session: state.session
	}),
	{
		uploadPictures:(data) => ({type: 'UPLOAD_PICTURE', payload:data})
	}
)(UserPhotos)