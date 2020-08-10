import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import stylesheets
import "./styles/index.css";
import "./styles/font.css";
import "./styles/nightMode.css";


import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import Roomlist from './components/Roomlist/Roomlist';


const App = () => (
	<Router>
		<Route path="/" exact component={Login} />	{/*Login Page*/}
		<Route path="/registration" exact component={Registration} />	{/*Chat Page*/}
		<Route path="/roomlist" exact component={Roomlist} />	
	</Router>
);


export default App;