import React, { useState, useEffect } from 'react';

import { useHistory } from "react-router";

import axios from 'axios';

// Import Header 
import Header from '../Header/Header';

// Import css
import '../../styles/form.css';
import './Registration.responsive.css';

// Images
import torontoMap from '../../images/torontoMap.png';


const Registration = ({location}) => {

	const mailPattern = new RegExp(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+/);  // kodesektor@rocketmail.com

	let history = useHistory();
	const [chatroomRedir, setChatroomRedir] = useState(false);

	const [loginID, setLoginID] = useState('');

	const [active, setActive] = useState(false);	// For button
	const [hideApp, setHideApp] = useState(false);	// For entire app
	const [hideModal, setHideModal] = useState(false);	// For modal

	// Form Validation
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [origin, setOrigin] = useState('Afghanistan');
	const [sex, setSex] = useState('Male');

	// Chat Data
	const [countryLoc, setCountryLoc] = useState('');
	const [stateLoc, setStateLoc] = useState('');
	const [districtLoc, setDistrictLoc] = useState('');
	const [roadLoc, setRoadLoc] = useState('');

	// Set states for the form fields on keyup
	const [nullFields, setNullFields] = useState({
											name : false,
											email : false,
											password : false
										});
	const [regexMail, setRegexMail] = useState(false);

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
		console.log(resUserDetails);
    	console.log(resUserDetails, resFilteredOrigin, resFilteredDistrict);

    	if (chatroomRedir) {	// Protect from redirection upon page load
    		const localObj = {
    			resUserDetails,
    			resFilteredOrigin,
    			resFilteredDistrict
    		}

    		localStorage.removeItem(loginID);	// First clear local storage to avoid duplicates
    			
    		localStorage.setItem(loginID, JSON.stringify(localObj));	// Then save in local storage

    		history.push(`/roomlist?id=${loginID}`)
    	}

	}, [resUserDetails, resFilteredOrigin, resFilteredDistrict, chatroomRedir]);


	// On form submit
	const handleSubmit = e => {

		e.preventDefault();

	    const fields = Object.values(nullFields);	// Fetch form field state
	    // console.log(fields);

	    const errors = fields.some(field => field === false);	// any empty field?
	    // console.log (errors);

	    if (errors || !regexMail) {

	    	setErrorDisplay(true);	// state to display error on form submit
	    	console.log(errorDisplay);

	    	e.preventDefault();		// form goes no where
	    	console.log(email, nullFields)

	    } else {

	    	e.preventDefault();

	    	console.log (countryLoc, stateLoc);
	    	// If no errors, check login details. If right, fetch details of the user
	    	axios.post("http://localhost:5003/user/registration", {
    			params : {
    				name : username,
    				password : password,
    				email,
    				origin,
    				sex,

    				countryLoc,
    				stateLoc,
    				districtLoc,
    				roadLoc
    			}
    		})
	        .then(response => {
	        	console.log(response.data);

	        	if (response.data) {
	        		let jsonUserDetails = (response.data.jsonUserDetails);
	        		let jsonFilteredOrigin = (response.data.jsonFilteredOrigin);
	        		let jsonFilteredDistrict = (response.data.jsonFilteredDistrict);

	        		setResUserDetails([jsonUserDetails]);
	        		setResFilteredOrigin([jsonFilteredOrigin]);
	        		setResfilteredDistrict([jsonFilteredDistrict]);

	        		setLoginID(response.data.jsonUserDetails.loginID);

	        		if (response.data.userExists) {
	        			alert ("User already registered. Try again or proceed to Login");
	        		} else {
	        			setChatroomRedir(true);	// Time to redirect
	        		}
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

		// console.log (name)
		// console.log(value);

		switch (name) {

		  	case "name":
		  		setUsername(value);

	      		if (value.length === 0 ) {	// null fields not allowed
	      			setNullFields({...nullFields, name : false})
	      		} else {
	      			setNullFields({...nullFields, name : true})
	      		}
		    break;

		  	case "email":
			  	setEmail(value);

		  		if (!mailPattern.test(value)) {
		  			setRegexMail(false);
				} else {
					setRegexMail(true);
				}

			  	if (value.length === 0 ) {	// null fields not allowed
			  		setNullFields({...nullFields, email : false})
			  	} else {
			  		setNullFields({...nullFields, email : true})
			  	}

			break;

			case "password" : 
				setPassword(value);

				if (value.length === 0 ) {	// null fields not allowed
					setNullFields({...nullFields, password : false})
				} else {
					setNullFields({...nullFields, password : true})
				}

			break;

			case "origin" : 
				setOrigin(value);

			break;

			case "sex":
				setSex(value);

		    break;

		  	default:
		    	break;
		}	

	}

	function geocode (lat, long) {

		// TURN THIS INTO A FUNCTION FOR REVERSE GEOCODING
		
		const apikey = 'df086dd115604a588664d685b67adc33';
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

		    if (request.status === 200) { 
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
	function geolocate () {
		//const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {

		// Use getCurrentPosition for now to limit no of fetches and not surpass daily limit
		navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
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

		// Modal must only appear on login page to avoid error

		geolocate();
		
		// geolocate().then(closeModal(true));	Modal keeps breaking page; not sure why

	}, [location.search]);


	return (

		<>

		{/*class 'hideApp' is responsible for hiding the entire app if user declines putting his location 
		   class 'hide' is responsible for simply sliding up modal when user accepts location use
		*/}
		<Header headerTxt={HeaderTxt()} /> 


		<main id="registration-handlebars">
		    
		    <div className="main-wrapper">
		    
		        <section className="register-now">

		        <section className="connect">
		            <h1 className="header">Sign Up</h1>
		            <p>Connect with People Close By</p>
		            
		            <div className="toronto-map">
		                <img src={torontoMap} alt="toronto map"/>
		            </div>
		            
		        </section>

		        <section className="registration">

		            <form action="/user/registration" method="POST" className="register"
		            	onSubmit={(event) => handleSubmit(event)}>

		                <div className="form-group">
		                    <label htmlFor="name">Username</label>
		                    <input type="text" name="name" id="name" className="register-input"
		                    	onChange={(event) => handleChange(event)}/>

	                    	{((nullFields.name === false) && (errorDisplay === true)) && (
	                    		<span className="error">Username should not be empty <span className="fa fa-exclamation-triangle"></span></span>
	                    	              )}
		                </div>
		                <div className="form-group">
		                    <label htmlFor="email">Email</label>
		                    <input type="email" name="email" id="email" className="register-input" pattern="^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,6})$"
		                    	onChange={(event) => handleChange(event)}/>

		                    {((nullFields.email === false) && (errorDisplay === true)) && (
		                    	<span className="error">Email should not be empty <span className="fa fa-exclamation-triangle"></span></span>
		                                  )}

		                    {((nullFields.email === true) && (regexMail === false) && (errorDisplay === true)) && (
		                    	<span className="error">Email does not match pattern <span className="fa fa-exclamation-triangle"></span></span>
		                                  )}
		                </div>
		                <div className="form-group">
		                    <label htmlFor="password">Password</label>
		                    <input type="password" name="password" id="password" className="register-input"
		                    	onChange={(event) => handleChange(event)}/>
		                </div>

		                	{((nullFields.password === false) && (errorDisplay === true)) && (
		                		<span className="error">Password should not be empty <span className="fa fa-exclamation-triangle"></span></span>
		                	              )}

		                <div className="form-group">
		                    <label htmlFor="origin">Country of Origin</label>
		                    <select id="origin" name="origin" className="register-input" required
		                    	onChange={(event) => handleChange(event)}>
		                       <option value="Afganistan">Afghanistan</option>
		                       <option value="Albania">Albania</option>
		                       <option value="Algeria">Algeria</option>
		                       <option value="American Samoa">American Samoa</option>
		                       <option value="Andorra">Andorra</option>
		                       <option value="Angola">Angola</option>
		                       <option value="Anguilla">Anguilla</option>
		                       <option value="Antigua & Barbuda">Antigua & Barbuda</option>
		                       <option value="Argentina">Argentina</option>
		                       <option value="Armenia">Armenia</option>
		                       <option value="Aruba">Aruba</option>
		                       <option value="Australia">Australia</option>
		                       <option value="Austria">Austria</option>
		                       <option value="Azerbaijan">Azerbaijan</option>
		                       <option value="Bahamas">Bahamas</option>
		                       <option value="Bahrain">Bahrain</option>
		                       <option value="Bangladesh">Bangladesh</option>
		                       <option value="Barbados">Barbados</option>
		                       <option value="Belarus">Belarus</option>
		                       <option value="Belgium">Belgium</option>
		                       <option value="Belize">Belize</option>
		                       <option value="Benin">Benin</option>
		                       <option value="Bermuda">Bermuda</option>
		                       <option value="Bhutan">Bhutan</option>
		                       <option value="Bolivia">Bolivia</option>
		                       <option value="Bonaire">Bonaire</option>
		                       <option value="Bosnia & Herzegovina">Bosnia & Herzegovina</option>
		                       <option value="Botswana">Botswana</option>
		                       <option value="Brazil">Brazil</option>
		                       <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
		                       <option value="Brunei">Brunei</option>
		                       <option value="Bulgaria">Bulgaria</option>
		                       <option value="Burkina Faso">Burkina Faso</option>
		                       <option value="Burundi">Burundi</option>
		                       <option value="Cambodia">Cambodia</option>
		                       <option value="Cameroon">Cameroon</option>
		                       <option value="Canada">Canada</option>
		                       <option value="Canary Islands">Canary Islands</option>
		                       <option value="Cape Verde">Cape Verde</option>
		                       <option value="Cayman Islands">Cayman Islands</option>
		                       <option value="Central African Republic">Central African Republic</option>
		                       <option value="Chad">Chad</option>
		                       <option value="Channel Islands">Channel Islands</option>
		                       <option value="Chile">Chile</option>
		                       <option value="China">China</option>
		                       <option value="Christmas Island">Christmas Island</option>
		                       <option value="Cocos Island">Cocos Island</option>
		                       <option value="Colombia">Colombia</option>
		                       <option value="Comoros">Comoros</option>
		                       <option value="Congo">Congo</option>
		                       <option value="Cook Islands">Cook Islands</option>
		                       <option value="Costa Rica">Costa Rica</option>
		                       <option value="Cote DIvoire">Cote DIvoire</option>
		                       <option value="Croatia">Croatia</option>
		                       <option value="Cuba">Cuba</option>
		                       <option value="Curaco">Curacao</option>
		                       <option value="Cyprus">Cyprus</option>
		                       <option value="Czech Republic">Czech Republic</option>
		                       <option value="Denmark">Denmark</option>
		                       <option value="Djibouti">Djibouti</option>
		                       <option value="Dominica">Dominica</option>
		                       <option value="Dominican Republic">Dominican Republic</option>
		                       <option value="East Timor">East Timor</option>
		                       <option value="Ecuador">Ecuador</option>
		                       <option value="Egypt">Egypt</option>
		                       <option value="El Salvador">El Salvador</option>
		                       <option value="Equatorial Guinea">Equatorial Guinea</option>
		                       <option value="Eritrea">Eritrea</option>
		                       <option value="Estonia">Estonia</option>
		                       <option value="Ethiopia">Ethiopia</option>
		                       <option value="Falkland Islands">Falkland Islands</option>
		                       <option value="Faroe Islands">Faroe Islands</option>
		                       <option value="Fiji">Fiji</option>
		                       <option value="Finland">Finland</option>
		                       <option value="France">France</option>
		                       <option value="French Guiana">French Guiana</option>
		                       <option value="French Polynesia">French Polynesia</option>
		                       <option value="French Southern Ter">French Southern Ter</option>
		                       <option value="Gabon">Gabon</option>
		                       <option value="Gambia">Gambia</option>
		                       <option value="Georgia">Georgia</option>
		                       <option value="Germany">Germany</option>
		                       <option value="Ghana">Ghana</option>
		                       <option value="Gibraltar">Gibraltar</option>
		                       <option value="Great Britain">Great Britain</option>
		                       <option value="Greece">Greece</option>
		                       <option value="Greenland">Greenland</option>
		                       <option value="Grenada">Grenada</option>
		                       <option value="Guadeloupe">Guadeloupe</option>
		                       <option value="Guam">Guam</option>
		                       <option value="Guatemala">Guatemala</option>
		                       <option value="Guinea">Guinea</option>
		                       <option value="Guyana">Guyana</option>
		                       <option value="Haiti">Haiti</option>
		                       <option value="Hawaii">Hawaii</option>
		                       <option value="Honduras">Honduras</option>
		                       <option value="Hong Kong">Hong Kong</option>
		                       <option value="Hungary">Hungary</option>
		                       <option value="Iceland">Iceland</option>
		                       <option value="Indonesia">Indonesia</option>
		                       <option value="India">India</option>
		                       <option value="Iran">Iran</option>
		                       <option value="Iraq">Iraq</option>
		                       <option value="Ireland">Ireland</option>
		                       <option value="Isle of Man">Isle of Man</option>
		                       <option value="Israel">Israel</option>
		                       <option value="Italy">Italy</option>
		                       <option value="Jamaica">Jamaica</option>
		                       <option value="Japan">Japan</option>
		                       <option value="Jordan">Jordan</option>
		                       <option value="Kazakhstan">Kazakhstan</option>
		                       <option value="Kenya">Kenya</option>
		                       <option value="Kiribati">Kiribati</option>
		                       <option value="Korea North">Korea North</option>
		                       <option value="Korea Sout">Korea South</option>
		                       <option value="Kuwait">Kuwait</option>
		                       <option value="Kyrgyzstan">Kyrgyzstan</option>
		                       <option value="Laos">Laos</option>
		                       <option value="Latvia">Latvia</option>
		                       <option value="Lebanon">Lebanon</option>
		                       <option value="Lesotho">Lesotho</option>
		                       <option value="Liberia">Liberia</option>
		                       <option value="Libya">Libya</option>
		                       <option value="Liechtenstein">Liechtenstein</option>
		                       <option value="Lithuania">Lithuania</option>
		                       <option value="Luxembourg">Luxembourg</option>
		                       <option value="Macau">Macau</option>
		                       <option value="Macedonia">Macedonia</option>
		                       <option value="Madagascar">Madagascar</option>
		                       <option value="Malaysia">Malaysia</option>
		                       <option value="Malawi">Malawi</option>
		                       <option value="Maldives">Maldives</option>
		                       <option value="Mali">Mali</option>
		                       <option value="Malta">Malta</option>
		                       <option value="Marshall Islands">Marshall Islands</option>
		                       <option value="Martinique">Martinique</option>
		                       <option value="Mauritania">Mauritania</option>
		                       <option value="Mauritius">Mauritius</option>
		                       <option value="Mayotte">Mayotte</option>
		                       <option value="Mexico">Mexico</option>
		                       <option value="Midway Islands">Midway Islands</option>
		                       <option value="Moldova">Moldova</option>
		                       <option value="Monaco">Monaco</option>
		                       <option value="Mongolia">Mongolia</option>
		                       <option value="Montserrat">Montserrat</option>
		                       <option value="Morocco">Morocco</option>
		                       <option value="Mozambique">Mozambique</option>
		                       <option value="Myanmar">Myanmar</option>
		                       <option value="Nambia">Nambia</option>
		                       <option value="Nauru">Nauru</option>
		                       <option value="Nepal">Nepal</option>
		                       <option value="Netherland Antilles">Netherland Antilles</option>
		                       <option value="Netherlands">Netherlands (Holland, Europe)</option>
		                       <option value="Nevis">Nevis</option>
		                       <option value="New Caledonia">New Caledonia</option>
		                       <option value="New Zealand">New Zealand</option>
		                       <option value="Nicaragua">Nicaragua</option>
		                       <option value="Niger">Niger</option>
		                       <option value="Nigeria">Nigeria</option>
		                       <option value="Niue">Niue</option>
		                       <option value="Norfolk Island">Norfolk Island</option>
		                       <option value="Norway">Norway</option>
		                       <option value="Oman">Oman</option>
		                       <option value="Pakistan">Pakistan</option>
		                       <option value="Palau Island">Palau Island</option>
		                       <option value="Palestine">Palestine</option>
		                       <option value="Panama">Panama</option>
		                       <option value="Papua New Guinea">Papua New Guinea</option>
		                       <option value="Paraguay">Paraguay</option>
		                       <option value="Peru">Peru</option>
		                       <option value="Phillipines">Philippines</option>
		                       <option value="Pitcairn Island">Pitcairn Island</option>
		                       <option value="Poland">Poland</option>
		                       <option value="Portugal">Portugal</option>
		                       <option value="Puerto Rico">Puerto Rico</option>
		                       <option value="Qatar">Qatar</option>
		                       <option value="Republic of Montenegro">Republic of Montenegro</option>
		                       <option value="Republic of Serbia">Republic of Serbia</option>
		                       <option value="Reunion">Reunion</option>
		                       <option value="Romania">Romania</option>
		                       <option value="Russia">Russia</option>
		                       <option value="Rwanda">Rwanda</option>
		                       <option value="St Barthelemy">St Barthelemy</option>
		                       <option value="St Eustatius">St Eustatius</option>
		                       <option value="St Helena">St Helena</option>
		                       <option value="St Kitts-Nevis">St Kitts-Nevis</option>
		                       <option value="St Lucia">St Lucia</option>
		                       <option value="St Maarten">St Maarten</option>
		                       <option value="St Pierre & Miquelon">St Pierre & Miquelon</option>
		                       <option value="St Vincent & Grenadines">St Vincent & Grenadines</option>
		                       <option value="Saipan">Saipan</option>
		                       <option value="Samoa">Samoa</option>
		                       <option value="Samoa American">Samoa American</option>
		                       <option value="San Marino">San Marino</option>
		                       <option value="Sao Tome & Principe">Sao Tome & Principe</option>
		                       <option value="Saudi Arabia">Saudi Arabia</option>
		                       <option value="Senegal">Senegal</option>
		                       <option value="Seychelles">Seychelles</option>
		                       <option value="Sierra Leone">Sierra Leone</option>
		                       <option value="Singapore">Singapore</option>
		                       <option value="Slovakia">Slovakia</option>
		                       <option value="Slovenia">Slovenia</option>
		                       <option value="Solomon Islands">Solomon Islands</option>
		                       <option value="Somalia">Somalia</option>
		                       <option value="South Africa">South Africa</option>
		                       <option value="Spain">Spain</option>
		                       <option value="Sri Lanka">Sri Lanka</option>
		                       <option value="Sudan">Sudan</option>
		                       <option value="Suriname">Suriname</option>
		                       <option value="Swaziland">Swaziland</option>
		                       <option value="Sweden">Sweden</option>
		                       <option value="Switzerland">Switzerland</option>
		                       <option value="Syria">Syria</option>
		                       <option value="Tahiti">Tahiti</option>
		                       <option value="Taiwan">Taiwan</option>
		                       <option value="Tajikistan">Tajikistan</option>
		                       <option value="Tanzania">Tanzania</option>
		                       <option value="Thailand">Thailand</option>
		                       <option value="Togo">Togo</option>
		                       <option value="Tokelau">Tokelau</option>
		                       <option value="Tonga">Tonga</option>
		                       <option value="Trinidad & Tobago">Trinidad & Tobago</option>
		                       <option value="Tunisia">Tunisia</option>
		                       <option value="Turkey">Turkey</option>
		                       <option value="Turkmenistan">Turkmenistan</option>
		                       <option value="Turks & Caicos Is">Turks & Caicos Is</option>
		                       <option value="Tuvalu">Tuvalu</option>
		                       <option value="Uganda">Uganda</option>
		                       <option value="United Kingdom">United Kingdom</option>
		                       <option value="Ukraine">Ukraine</option>
		                       <option value="United Arab Erimates">United Arab Emirates</option>
		                       <option value="United States of America">United States of America</option>
		                       <option value="Uraguay">Uruguay</option>
		                       <option value="Uzbekistan">Uzbekistan</option>
		                       <option value="Vanuatu">Vanuatu</option>
		                       <option value="Vatican City State">Vatican City State</option>
		                       <option value="Venezuela">Venezuela</option>
		                       <option value="Vietnam">Vietnam</option>
		                       <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
		                       <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
		                       <option value="Wake Island">Wake Island</option>
		                       <option value="Wallis & Futana Is">Wallis & Futana Is</option>
		                       <option value="Yemen">Yemen</option>
		                       <option value="Zaire">Zaire</option>
		                       <option value="Zambia">Zambia</option>
		                       <option value="Zimbabwe">Zimbabwe</option>
		                    </select>
		                </div>

		                <div className="form-group register-switch">
		                    <input type="radio" name="sex" id="female" value="female" className="register-switch-input" 
		                    	onChange={(event) => handleChange(event)}/>
		                    <label htmlFor="female" className="register-switch-label">Female</label>

		                    <input type="radio" name="sex" id="male" value="male" className="register-switch-input" defaultChecked
		                    	onChange={(event) => handleChange(event)}/>
		                    <label htmlFor="male" className="register-switch-label">Male</label>
		                </div>

		                <input type="hidden" id="location-country" name="location-country" value=""/> 
		                <input type="hidden" id="location-state" name="location-state" value=""/>
		                <input type="hidden" id="location-district" name="location-district" value=""/>
		                <input type="hidden" id="location-road" name="location-road" value=""/>

		                <div className="form-group">
		                    <input type="submit" name="submit-btn" id="submit-btn" value="Get Started" className="register-button"/>
		                </div>

		            </form>

		            <p className="have-account">Already have an account? <a href="login">Sign in instead</a></p>

		        </section>
		            
		    </section>
		    
		    </div>
		
		</main>

		<section className={`dialog-app-modal ${hideApp === true ? ' hide-app' : ''} ${hideModal === true ? ' hide' : ''}`} id="dialog-app-modal">
		    <div className="modal-app-alert">
		        <h3 className="app-alert">CHAT-LOC is dependent on your location. Please turn it on for access.</h3>

		        <button id="app-alert-close" className={`app-alert-close ${active === true ? ' allowed' : ''}`}
		        	onClick={(event) => closeModal()}>Close</button>

		    </div>
		</section>

		</>
		
	)
}

export default Registration;