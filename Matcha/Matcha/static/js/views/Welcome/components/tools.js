import { historyPush } from '../../../config/history'

export const checkInputs = (nom, prenom, changeState, registerMail, pseudo, registerPassword, confirmPassword) => {
	let flag = 0
	const passRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

	const pass = /^.*(?=.{8,})((?=.*[!?@#$%^&*()/\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
	if (registerPassword !== confirmPassword ||
		registerPassword === '' || !pass.test(registerPassword)) {
		alert("Vos mots de passes sont-ils identiques? Rappel: Votre mot de passe doit contenir au moins 8 charactères dont au moins une majuscule, 1 chiffre et 1 charactere spécial.")
		changeState('wrongPass', true)
		flag++
	} else {
		changeState('wrongPass', false)
	}
	if (registerMail.length < 3 ||
		 !passRegex.test(registerMail)) {
		flag++
		changeState('wrongMail', true)
	} else {
		changeState('wrongMail', false)
	}
	if (pseudo.length < 4) {
		flag++
		changeState('wrongUsername', true)
	} else {
		changeState('wrongUsername', false)
	}
	if (nom.length < 2 || prenom.length < 2) {
		changeState('wrongName', true)
		flag++
	} else {
		changeState('wrongName', false)
	}

	return flag === 0
}

export const checkLogin = (response) => {
	if (response['status'] === 200) {
		historyPush(`/Profile/${response['username']}`)
	} else {
		alert(response['message'])
	}
}