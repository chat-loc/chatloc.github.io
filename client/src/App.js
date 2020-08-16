import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import stylesheets
import "./styles/index.css";
import "./styles/index.responsive.css";
import "./styles/font.css";
import "./styles/night-mode.css";


import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import Roomlist from './components/Roomlist/Roomlist';
import Chatroom from './components/Chatroom/Chatroom';


const App = () => (
	<Router>
		<Route path="/" exact component={Login} />	{/*Login Page*/}
		<Route path="/registration" exact component={Registration} />	{/*Chat Page*/}
		<Route path="/roomlist" exact component={Roomlist} />	
		<Route path="/chatroom" component={Chatroom} />	
	</Router>
);


export default App;