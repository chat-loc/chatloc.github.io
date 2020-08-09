import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Helps retrieve data from URL*/

import queryString from 'query-string';
// Import script files here;

import Script from 'react-script-tag';

// Import css
import '../form.css';

// Images
import torontoMap from '../../images/torontoMap.png';



const Login = ({location}) => {

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	const [active, setActive] = useState(false);	// For button
	const [hideApp, setHideApp] = useState(false);	// For button
	const [hideModal, setHideModal] = useState(false);	// For button


	const ENDPOINT = "localhost:3000";	// Put your heroku website link if deployed. This is the PORT no (endpoint) of the index.js file in "server" dir


	function geocode (lat, long) {

		// TURN THIS INTO A FUNCTION FOR REVERSE GEOCODING
		
		const apikey = '4cf0cfd43e054b6aa5d2a835ca15449f';
		const latitude =	lat; // '43.6205';
		const longitude = 	long; // '-79.5132';

		const api_url = 'https://api.opencagedata.com/geocode/v1/json'

		var request_url = api_url
		    + '?'
		    + 'key=' + apikey
		    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
		    + '&pretty=1'
		    + '&no_annotations=1';

		  // see full list of required and optional parameters:
		  // https://opencagedata.com/api#forward

		const request = new XMLHttpRequest();
		request.open('GET', request_url, true);

		request.onload = function() {
		    // see full list of possible response codes:
		    // https://opencagedata.com/api#codes

		    if (request.status == 200) { 
		        // Success!
		        let data = JSON.parse(request.responseText);
		        alert("Response went");
		        console.log (data);

		        let components = data.results[0].components;
		        console.log(components);

		        /*
		        ISO_3166-1_alpha-2: "CA"
				ISO_3166-1_alpha-3: "CAN"
				city: "Toronto"
				city_district: "Etobicoke North"
				continent: "North America"
				country: "Canada"
				country_code: "ca"
				house_number: "13"
				neighbourhood: "West Humber Estates"
				postcode: "M9V 3W9"
				road: "Milkwood Avenue"
				state: "Ontario"
				state_code: "ON"
				_category: "building"
				_type: "building"
				*/

		        const {country, state, city_district, road} = components;

		    } else if (request.status <= 500){ 

		    	console.log("Error reaching server");
		    	setHideApp(true);

		        // We reached our target server, but it returned an error
		        console.log("Unable to geocode! Response code: " + request.status);
		                             
	            let data = JSON.parse(request.responseText);
	            console.log(data.status.message);

	            alert('There is a server error, Please try again later');

		    } else {
		    	setHideApp(true);
		    	console.log("server error");
		    	alert('There is a server error, Please try again later');
		    }
		};

		request.onerror = function() {
		    // There was a connection error of some sort
		    console.log("Unable to connect to server");       
		    alert ("Unable to connect to server") ;
		};

		request.send();  // make the request

	}


	// User accepts to share location
	const successCallback = (position) => {

		/*
		GeolocationPosition: {
			coords: GeolocationCoordinates
			accuracy: 3642
			altitude: null
			altitudeAccuracy: null
			heading: null
			latitude: 43.7257028
			longitude: -79.59404339999999
			speed: null
		}
		*/

		// Only target for login page
		setActive(true);
		// $appClose.classList.add('allowed');	// enable button interaction if user accepts location sharing

		// Unpack latlong values
		const {latitude, longitude} = position.coords;

		geocode(latitude, longitude);
		
	}

	// If user declines to share location, interrupt app
	const errorCallback = (error) => {
		console.log(error);
		/*$page.style.display = 'none';
		$dialogModal.style.display = 'none';*/
	}

	// Get location. 
	async function geolocate () {
		const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
			enableHighAccuracy : true, 	//try best to provide with a high accurate location
			timeout: 5000
		});	
	}

	const closeModal = () => {
		setHideModal(true);		
	}


	useEffect (() => {

		// geocode("43.6205", "-79.5132");

		// Modal must only appear on login page to avoid error
		// geolocate().then(closeModal(true));

	}, [ENDPOINT, location.search]);


	return (

		<>

		{/*class 'hideApp' is responsible for hiding the entire app if user declines putting his location 
		   class 'hide' is responsible for simply sliding up modal when user accepts location use
		*/}
		        
		<main className={`login-main ${hideApp == true ? ' hide-app' : ''}`}>
		    
		    <div className="main-wrapper">
		    
		        <section className="register-now">

		        <section className="connect">
		            <h1 className="header">Log In</h1>
		            <p>Connect with People Close By</p>
		            
		            <div className="toronto-map">
		                <img src={torontoMap} alt="toronto map"/>
		            </div>
		            
		        </section>

		        <section className="registration">

		            <form action="/user/login" method="POST" className="register">
		                <div className="form-group">
		                    <label htmlFor="name">Username</label>
		                    <input type="text" name="name" id="name" className="register-input" required/>
		                </div>

		                <div className="form-group">
		                    <label htmlFor="password">Password</label>
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

		<section className={`hide dialog-app-modal ${hideApp == true ? ' hide-app' : ''} ${hideModal == true ? ' hide' : ''}`} id="dialog-app-modal">
		    <div className="modal-app-alert">
		        <h3 className="app-alert">CHAT-LOC is dependent on your location. Please turn it on for access.</h3>

		        <button id="app-alert-close" className={`app-alert-close ${active == true ? ' allowed' : ''}`}>Close</button>

		    </div>
		</section>

		</>
		
	)
}

export default Login;