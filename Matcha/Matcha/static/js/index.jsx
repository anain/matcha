import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './styles/patterns.css'
import 'gridlex'
import './styles/animations/animations.css'
import store from './store/createStore'
import { SnackbarProvider } from 'notistack'
import './styles/index.css'

ReactDOM.render(<SnackbarProvider maxSnack={2}><App store={store} style={{height: '100vh'}} /></SnackbarProvider>, document.getElementById("content"));