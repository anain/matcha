import Wrapper from "../Wrapper"
import React from 'react'

const componentStyle = (theme) => {
	return {
		button: {
			backgroundColor: theme.palette.primaryColor,
			color: '#ffffff',
			cursor: 'pointer',
			height: '40px',
			borderRadius: '40px',
			fontSize: '18px'
		},
		emptyButton : {
			border: `3px solid ${theme.palette.primaryColor}`,
			backgroundColor: 'none',
			cursor: 'pointer',
			height: '50px',
			color: theme.palette.primaryColor,
			borderRadius: '40px',
			fontSize: '20px',
			fontWeight: 100,
			'&:hover': {
				backgroundColor: theme.palette.primaryColor,
				color: '#ffffff'
			}
		}
	}
}

const Button = ({ classes, style, title, empty, onClick, loading}) => {
    return (
		<div
			onClick={onClick}
			className={`fullWidth flex center alignCenter
			${empty ? classes.emptyButton : classes.button}`}
			style={{ ...style }}
		>
			{loading ? 'Chargement' : title}
		</div>
    )
}

export default Wrapper(componentStyle)()(Button)