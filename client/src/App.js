import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import stylesheets
import "./styles/index.css";
import "./styles/font.css";
import "./styles/nightMode.css";


import Login from './components/Login/Login';

const App = () => (
	<Router>
		<Route path="/" exact component={Login} />	{/*Login Page*/}
	</Router>
);


export default App;