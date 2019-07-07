import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Wrapper from '../../Wrapper'
import Button from '../../components/button'

const styles = (theme) => {
  return {
    dialogRoot: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    dialogContainer: {
      width: '460px',
      justifyContent: 'center',
      borderRadius: '15px',
      minHeight: '400px'
    },
    mobileDialogContainer: {
      width: '100%',
      justifyContent: 'center',
      borderRadius: '15px',
      minHeight: '100%'
    }
  }
}

class CompleteProfileDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state={
    }
  }

  render () {
    const { classes, open, mobile, changeState } = this.props
    return (
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={mobile}
          onBackdropClick={()=>{changeState('showDialog', false)}}
          classes={{
            root: classes.dialogRoot,
            paper: mobile ? classes.mobileDialogContainer : classes.dialogContainer
          }}
        >
          <div className={`fullWidth column flex center alignCenter`} style={{textAlign: 'center'}}>
              <div style={{fontSize: '28px', color: '#ff6c6c', width: '85%'}}>
                Faisons plus ample connaissance
              </div>
              <div style={{color: '#6c6c6c', fontSize: '20', width: '80%', padding: '16px 0px 22px 0px'}}>
                Afin que tu puisses accéder aux likes et chatter avec tes matchs il faut que ton profil soit rempli.
                <span style={{fontSize: '20', color: '#ff6c6c'}}>
                  {` C'est simple, il suffit de cliquer sur les champs que tu souhaites changer ! `}
                </span>
                Allez, dernier effort c'est promis. N'oublie pas de rajouter des petites photos de toi !</div>
              <Button title='Ok' onClick={()=>{changeState('showDialog', false)}} color="primary" style={{width: '70%'}} empty/>
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
)(CompleteProfileDialog)