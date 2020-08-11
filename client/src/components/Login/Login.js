import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router";

import axios from 'axios';

/* Helps retrieve data from URL*/
import queryString from 'query-string';

// Import Header 
import Header from '../Header/Header';

// Import css
import '../form.css';

// Images
import torontoMap from '../../images/torontoMap.png';



const Login = ({location}) => {

	const ENDPOINT = "localhost:3000";	// Put your heroku website link if deployed. This is the PORT no (endpoint) of the index.js file in "server" dir
	let history = useHistory();
	const [chatroomRedir, setChatroomRedir] = useState(false);

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	const [active, setActive] = useState(false);	// For button
	const [hideApp, setHideApp] = useState(false);	// For entire app
	const [hideModal, setHideModal] = useState(false);	// For modal

	// Form Validation
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// Chat Data
	const [countryLoc, setCountryLoc] = useState('');
	const [stateLoc, setStateLoc] = useState('');
	const [districtLoc, setDistrictLoc] = useState('');
	const [roadLoc, setRoadLoc] = useState('');

	// Set states for the form fields on keyup
	const [nullFields, setNullFields] = useState({
											name : false,
											password : false
										});

	// Set state for determining logic on form submit.
	// This is important because you want to show the errors on form submit
	// but then, you dont want to show the errors on page load. Thus this state
	// is necessary to be switched when user clicks submit button and then set
	// on the input fields as well as the previous nullFields state to determine
	// when to display errors which are on input and on form submit but not on 
	// page load 

	const [errorDisplay, setErrorDisplay] = useState(false);

	// SERVER 
	const [resUserDetails, setResUserDetails] = useState([]);
	const [resFilteredOrigin, setResFilteredOrigin] = useState([]);
	const [resFilteredDistrict, setResfilteredDistrict] = useState([]);


	useEffect (() => {
		
		// console.log(resUserDetails);
    	// console.log(resUserDetails, resFilteredOrigin, resFilteredDistrict);

    	if (chatroomRedir) {	// Protect from firing upon page load
    		const localObj = {
    			resUserDetails,
    			resFilteredOrigin,
    			resFilteredDistrict
    		}

    		let localItem = localStorage.removeItem("chat-loc");	// First clear local storage to avoid duplicates
    			
    		localStorage.setItem("chat-loc", JSON.stringify(localObj));	// Then save in local storage

    		history.push("/roomlist");
    	}

	}, [resUserDetails, resFilteredOrigin, resFilteredDistrict, chatroomRedir]);

	// On form submit

	const handleSubmit = e => {

	    const fields = Object.values(nullFields);	// Fetch form field state
	    // console.log(fields);

	    const errors = fields.some(field => field === false);	// any empty field?
	    // console.log (errors);

	    if (errors) {
	    	setErrorDisplay(true);	// state to display error on form submit
	    	console.log(errorDisplay);
	    	e.preventDefault();		// form goes no where
	    } else {

	    	e.preventDefault();
	    	console.log (countryLoc, stateLoc);
	    	// If no errors, check login details. If right, fetch details of the user
	    	axios.post("http://localhost:5003/user/login", {
    			params : {
    				name : username,
    				password : password,

    				countryLoc,
    				stateLoc,
    				districtLoc,
    				roadLoc
    			}
    		})
	        .then(response => {
	        	console.log(response);

	        	if (response.data) {
	        		let jsonUserDetails = (response.data.jsonUserDetails);
	        		let jsonFilteredOrigin = (response.data.jsonFilteredOrigin);
	        		let jsonFilteredDistrict = (response.data.jsonFilteredDistrict);

	        		setResUserDetails([jsonUserDetails]);
	        		setResFilteredOrigin([jsonFilteredOrigin]);
	        		setResfilteredDistrict([jsonFilteredDistrict]);

	        		setChatroomRedir(true);	// Time to redirect
    	        }

    	        console.log(resUserDetails);
	        })
	        .catch(function (error) {
	        	console.log(error);
	        	alert("There's a server error. Try again later");
	        })

    		console.log("no errors");
	    }

	};

	// Listen to onKeyup event , fetch name and value of field and provide error if empty
	// (will not show because the moment the user begins typing, the field is no longer
	// empty but no qualms anyway)

	const handleChange = e => {

		e.preventDefault();

		let { name, value } = e.target;	// deconstruct name and value from event target

		name = name.trim();
		value = value.trim();

		switch (name) {

		  	case "name":
		  		setUsername(value);

	      		if (value.length == 0 ) {	// null fields not allowed
	      			setNullFields({...nullFields, name : false})
	      		} else {
	      			setNullFields({...nullFields, name : true})
	      		}
		    break;

		  	case "password":
		  		setPassword(value);

			  	if (value.length == 0 ) {	// null fields not allowed
			  		setNullFields({...nullFields, password : false})
			  	} else {
			  		setNullFields({...nullFields, password : true})
			  	}
		    break;

		  	default:
		    	break;
		}	

	}

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

		        setCountryLoc(country);
		        setStateLoc(state);
		        setDistrictLoc(city_district);
		        setRoadLoc(road);

		        // console.log (countryLoc, stateLoc, districtLoc, roadLoc); won't show here; not sure why

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
		    setHideApp(true);
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
		alert("You have decided not to use Chat-Loc.");
		setHideApp(true);
	}

	// Get location. 
	async function geolocate () {
		//const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {

		// Use getCurrentPosition for now to limit no of fetches and not surpass daily limit
		const watchId = navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
			enableHighAccuracy : true, 	//try best to provide with a high accurate location
			timeout: 5000
		});	
	}

	const closeModal = () => {
		setHideModal(true);		
	}

	// Header text
	const HeaderTxt = () => {
	    const html = <div className="header-inner">
				        <h1>Welcome To Chat<span className="fa fa-link loc"></span>Loc</h1>
				    </div>;
		return html;

	}

	useEffect (() => {

			// geocode("43.6205", "-79.5132");

			// Modal must only appear on login page to avoid error
			
			geolocate().then(closeModal(true));

		}, [ENDPOINT, location.search]);

	return (

		<>

		{/*class 'hideApp' is responsible for hiding the entire app if user declines putting his location 
		   class 'hide' is responsible for simply sliding up modal when user accepts location use
		*/}
		<Header headerTxt={HeaderTxt()} /> 

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

		            <form action="/user/login" method="POST" className="register" 
		            	onSubmit={(event) => handleSubmit(event)}>

		                <div className="form-group">
		                    <label htmlFor="name">Username</label>
		                    <input type="text" name="name" id="name" className="register-input"  
		                    	onChange={(event) => handleChange(event)} required/>

		                    {((nullFields.name == false) && (errorDisplay == true)) && (
		                    	<span className="error">Username should not be empty <span className="fa fa-exclamation-triangle"></span></span>
		                                  )}
		                </div>

		                <div className="form-group">
		                    <label htmlFor="password">Password</label>
		                    <input type="password" name="password" id="password" className="register-input" 
		                    	onChange={(event) => handleChange(event)} required/>

		                    {((nullFields.password == false) && (errorDisplay == true)) && (
		                    	<span className="error">Password should not be empty <span className="fa fa-exclamation-triangle"></span></span>
		                                  )}
		                </div>

		                <input type="hidden" id="location-country" name="location-country" value=""/> 
		                <input type="hidden" id="location-state" name="location-state" value=""/>
		                <input type="hidden" id="location-district" name="location-district" value=""/>
		                <input type="hidden" id="location-road" name="location-road" value=""/>

		                <div className="form-group">
		                    <input type="submit" name="submit-btn" value="Log In" id="submit-btn" className="register-button"
		                    	onSubmit={(event) => handleSubmit(event)}/>
		                </div>

		            </form>

		            <p className="have-account">Already have an account?
		           		<Link to={"/registration"}>Register Instead</Link>
		            </p>

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