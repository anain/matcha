import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { theme } from './styles/theme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import AsyncComponent from './AsyncComponent'
import PageContainer from './views/components/appRoutes'

const redirect = (to) => <Redirect to={to} />

const welcome = () => import('./views/Welcome/index').catch((err)=>{
	'An error occurred while loading the component'
})
const profile = () => import('./views/Profile/index').catch((err)=>{
	'An error occurred while loading the component'
})
const messages = () => import('./views/Messages/index').catch((err)=>{
	'An error occurred while loading the component'
})
const home = () => import('./views/Home/index').catch((err)=>{
	'An error occurred while loading the component'
})
const settings = () => import('./views/Settings/index').catch((err)=>{
	'An error occurred while loading the component'
})
const resetpassword = () => import('./views/ResetPassword.jsx').catch((err)=>{
	'An error occurred while loading the component'
})
const resetpasswordMail = () => import('./views/ResetPasswordMail.jsx').catch((err)=>{
	'An error occurred while loading the component'
})
const redirection = () => import('./views/Redirection.jsx').catch((err)=>{
	'An error occurred while loading the component'
})

class Routes extends React.Component {
	render() {
		return (
      <MuiThemeProvider theme={theme}>
		<Switch>
			<Route exact path='/' component={() => redirect('/welcome')} />
			<Route path='/welcome' component={() => <AsyncComponent moduleProvider={welcome}/> }/>
			<Route path='/resetpassword-mail' component={() => <AsyncComponent moduleProvider={resetpasswordMail} /> }/>
			<Route path='/resetpassword' component={() => <AsyncComponent moduleProvider={resetpassword} /> }/>
			<Route exact path='/registration/success/' component={() => <AsyncComponent register moduleProvider={redirection}/> }/>
			<Route exact path='/registration/failure/' component={() => <AsyncComponent register failure moduleProvider={redirection}/> }/>
			<Route exact path='/updatedmail/success/' component={() => <AsyncComponent updateMail moduleProvider={redirection}/> }/>
			<Route exact path='/updatedmail/failure/' component={() => <AsyncComponent updateMail failure moduleProvider={redirection}/> }/>
			<Route
				path='/home'
				component={(props) => <PageContainer {...props} content={home}/>}
			/>
			<Route
				path='/profile'
				component={(props) => <PageContainer {...props} content={profile}/>}
			/>
			<Route
				path='/messages'
				component={(props) => <PageContainer {...props} content={messages}/>}
			/>
			<Route
				path='/settings'
				component={(props) => <PageContainer {...props} content={settings}/>}
			/>
			<Route component={() => <AsyncComponent noMatch moduleProvider={redirection}/> }/>
		</Switch>
      </MuiThemeProvider>
		)
	}
}



export default Routes