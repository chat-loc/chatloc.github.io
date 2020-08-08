import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// import .css files here;

const Login = () => {

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	return (

		<>
		        
		<main className="login-main">
		    
		    <div className="main-wrapper">
		    
		        <section className="register-now">

		        <section className="connect">
		            <h1 className="header">Log In</h1>
		            <p>Connect with People Close By</p>
		            
		            <div className="toronto-map">
		                <img src="/images/toronto-map.png" alt="toronto map">
		            </div>
		            
		        </section>

		        <section className="registration">

		            <form action="/user/login" method="POST" className="register">
		                <div className="form-group">
		                    <label for="name">Username</label>
		                    <input type="text" name="name" id="name" className="register-input" required/>
		                </div>

		                <div className="form-group">
		                    <label for="password">Password</label>
		                    <input type="password" name="password" id="password" className="register-input" required/>
		                </div>

		                <div className="form-group">
		                    <input type="submit" name="submit-btn" value="Log In" id="submit-btn" className="register-button"/>
		                </div>

		                <input type="hidden" id="location-country" name="location-country" value=""/> 
		                <input type="hidden" id="location-state" name="location-state" value=""/>
		                <input type="hidden" id="location-district" name="location-district" value=""/>
		                <input type="hidden" id="location-road" name="location-road" value=""/>

		            </form>

		            <p className="have-account">Already have an account? <a href="registration">Register instead</a></p>

		        </section>
		            
		    </section>
		    
		    </div>
		
		</main>

		<section className="dialog-app-modal" id="dialog-app-modal">
		    <div className="modal-app-alert">
		        <h3 className="app-alert">CHAT-LOC is dependent on your location. Please turn it on for access.</h3>
		        <button id="app-alert-close" className="app-alert-close">Close</button>
		    </div>
		</section>

		</>
		
	)
}

export default Login;