import Wrapper from "../Wrapper"
import React from 'react'

const componentStyle = (theme) => {
	return {
		logoLabelStyle: {
			width: 'initilal',
			fontSize: '40px',
			fontStyle: 'Black',
			color: theme.palette.primaryHoverColor,
			fontWeight: '800',
			cursor: 'pointer'
		}
	}
}

// font Avenir Black

const MatchaLogo = ({ classes, style }) => {
    return (
				<div
					className={classes.logoLabelStyle}
					style={style}
				>
					MATCHA
				</div>
    )
}

export default Wrapper(componentStyle)()(MatchaLogo)