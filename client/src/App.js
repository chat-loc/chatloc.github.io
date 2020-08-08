import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import Login from './components/Login/Login';

const App = () => (
	<Router>
		<Route path="/" exact component={Login} />	{/*Login Page*/}
	</Router>
);


export default App;