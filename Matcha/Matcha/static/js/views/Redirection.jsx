import React from 'react'
import Wrapper from './Wrapper'
import Button from './components/button'
import MatchaLogo from './components/matchaLogo.jsx'
import { historyPush } from '../config/history'

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
			padding: '35px 0px'
		}
	}
}

const Redirection = ({classes, noMatch, failure, updateMail, register}) => {

		const text = noMatch
			? "Cette page est introuvable."
			: updateMail
				? failure
					? "Changement de mail échoué"
					: "Votre mail a bien été modifié !"
				: register
					? failure
						? "La création de votre compte a échoué"
						: "Votre compte est créé !"
					: "Vous devez être connecté pour accéder à ce contenu."
		const text2 = noMatch
			? "Nous vous invitons à revenir à la page précédente."
			: updateMail
				? failure
					? " Nous vous invitons à réessayer ultérieurement."
					: " Nous vous invitons à vous reconnecter."
				: register
					? failure
						? " Nous vous invitons à réessayer ultérieurement."
						: " Vous pouvez désormais vous connecter."
					: " Merci de bien vouloir vous reconnecter."
    return (
        <div className={`fullWidth fullHeight flex center alignCenter ${classes.background}`}>
          <div className={`flex column center alignCenter ${classes.container}`}>
				<MatchaLogo style={{color: '#6f6d6d', padding: '10px'}}/>
				<div className={classes.errmsg}>
					{text}
					<span style={{color: 'salmon'}}>{text2}</span>
				</div>
          <Button
						style={{width: '80%', position: 'relative', top: '45px'}}
						title="Retour"
						empty
						onClick={() => { historyPush('/welcome') }}
					/>
					</div>
        </div>
    )
}

export default Wrapper(componentStyle)()(Redirection)