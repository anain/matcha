import React, { Component } from 'react'
import 'cropperjs/dist/cropper.css'
import Cropper from 'react-cropper'
import Wrapper from '../../Wrapper'
import Button from '../../components/button'

const styles = () => {
  return {
    cropperBox: {
      backgroundColor: 'white',
      boxShadow: '10px 5px 5px lightgrey',
      height: '800px',
      width: '800px',
      zIndex: '99',
      position: 'absolute'
    }
  }
}

class CropperComp extends Component {
    constructor (props) {
    super(props)
    this.validate = this.validate.bind(this)
    this.state = {
        pic: this.props.pic
      }
    }

  validate(){
    const cropped = this.refs.cropper.getCroppedCanvas(
      { 
        width: 300,
        height: 300,
        minWidth: 300,
        minHeight: 300,
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
      })
      cropped
        ? cropped.toBlob(function(blob) {
          let formData = new FormData()
          formData.append('picture', blob, 'profile_pic')
          this.props.picId && formData.append('id', this.props.picId)
          this.props.uploadPictures({formData: formData})
        }.bind(this), "image/jpeg", 0.75)
      : null
      this.props.changeState('cropperOpen', false)
    };


  render() {
    const {pic, cropperOpen, classes} = this.props
    const urlPic = cropperOpen ? URL.createObjectURL(pic) : ()=>{}
    return (
      <div
        className={`${classes.cropperBox} fullWidth flex column center alignCenter`}
        style={{display: cropperOpen ? 'flex' : 'hidden',}}
      >
        <Cropper
          ref='cropper'
          src={urlPic}
          aspectRatio={1 / 1}
          guides={false}
          style={{height: 500, width: 500}}
          autoCropArea={0.9}
          background={false}
          dragMode='move'
          viewMode={0}
          cropBoxResizable={false}
          cropBoxMovable={false}
          strict={true}
        />
          <Button
            onClick={()=>{
              this.validate()
            }}
            style={{width:'300px', height:'60px', margin: '10px 0px'}}
            title='Valider'
          />
      </div>
    );
  }
}

export default Wrapper(styles)(
	state=>({
	}),
	{
    uploadPictures:(data) => ({type: 'UPLOAD_PICTURE', payload:data}),
	}
  )(CropperComp)
