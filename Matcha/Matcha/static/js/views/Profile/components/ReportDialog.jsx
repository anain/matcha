import React from 'react'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import Checkbox from '@material-ui/core/Checkbox'
import Wrapper from '../../Wrapper'
import Button from '../../components/button'
import axios from 'axios'
const host = 'http://0.0.0.0:5000'

const styles = (theme) => {
  return {
    dialogRoot: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    dialogContainer: {
      minHeight: '500px',
      justifyContent: 'center',
      borderRadius: '15px',
      minWidth: '650px'
    }
  }
}

class ReportDialog extends React.Component {
  constructor(props) {
    super(props)
    this.sendReport=this.sendReport.bind(this)
    this.state={
      fakeProfile: false,
      behaviour: false,
      scam: false,
      other: false,
      reportComment: '',
      id: this.props.id
    }
  }

  sendReport() {
    const { fakeProfile, behaviour,
    scam, other, reportComment, id } = this.state

    const data = {
      'comment': reportComment,
      'charges': {
        fakeProfile: fakeProfile,
        behaviour: behaviour,
        scam: scam,
        other: other
      },
      'to_id': id
    }
    axios.post(host + '/report/', {data}).then((response) => {
      if (response.status === 200)
        alert('Le signalement a bien été envoyé')
      else
        alert('Une erreur s\'est produite lors du signalement. Nous vous prions de nous excuser pour ce désagrément. Veuillez réessayer plus tard.')
    })
    this.props.changeState('popUpOpen', false)
  }

  render () {
    const {username, classes, open, changeState, mobile} = this.props
    const { fakeProfile, behaviour, scam, other } = this.state
    return (
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={()=>{changeState('popUpOpen', false)}}
          fullScreen={mobile}
          classes={{
            root: classes.dialogRoot,
            paper: classes.dialogContainer
          }}
        >
          <div className={`fullWidth column flex center alignCenter`}>
              <div style={{fontSize: '30px', padding: '10px', marginTop: '20px', color: '#373636'}}>
                Signaler un utilisateur
              </div>
              <div style={{color: '#6c6c6c', fontSize: '18px', width: '80%'}}>
                Pour que Matcha reste un endroit de paix et d'amour, nous vous remercions de signaler tout comportement inapproprié.
                Ce signalement sera traité par notre équipe dans les plus brefs délais.
                <span style={{fontSize: '18px', width: '80%', color: '#ff6c6c'}}>
                  {` Je signale ${username} pour :`}
                </span>
              </div>
              <div style={{padding: '20px 20px 0px 45px', paddingLeft: '45px', alignSelf: 'baseline'}}>
                <div className='flex fullWidth row alignCenter'>
                  <Checkbox 
                    checked={this.state.fakeProfile}
                    onChange={()=>{this.setState({fakeProfile: !fakeProfile})}} 
                    color='primary'
                    /> <div style={{color: '#ff6c6c'}}>Faux profil</div>
                </div>
                <div className='flex fullWidth row alignCenter'>
                  <Checkbox 
                    checked={this.state.behaviour}
                    onChange={()=>{this.setState({behaviour: !behaviour})}} 
                    color='primary'
                    /> <div style={{color: '#ff6c6c'}}>Comportement agressif ou insultant</div>
                </div>
                <div className='flex fullWidth row alignCenter'>
                  <Checkbox 
                    checked={this.state.scam}
                    onChange={()=>{this.setState({scam: !scam})}} 
                    color='primary'
                    /> <div style={{color: '#ff6c6c'}}>Tentative d'escroquerie</div>
                </div>
                <div className='flex fullWidth row alignCenter'>
                  <Checkbox 
                    checked={this.state.other}
                    onChange={()=>{this.setState({other: !other})}} 
                    color='primary'
                    /> <div style={{color: '#ff6c6c'}}>Autre</div>
                </div>
              </div>
                <div style={{fontSize: '20px'}}>Commentaire:</div>
                <TextField
                  placeholder="Que s'est-il passé ?"
                  variant="outlined"
                  multiline
                  rows={5}
                  style={{
                    padding: '20px',
                    width: '80%'
                  }}
                  inputProps={{maxLength: 200}}
                  onChange={(event) => { this.setState({reportComment: event.target.value}) } }
                />
                <Button title='Envoyer' onClick={() => { this.sendReport() }} color="primary" style={{width: '80%', marginBottom: '30px'}} empty/>
          </div>
      </Dialog>
    )
  }
}

export default Wrapper(styles)(
  (state) => ({
    id: state.users.id,
    username: state.users.username
  })
)(ReportDialog)