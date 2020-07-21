

	const $appClose = document.querySelector('#app-alert-close');
	const $dialogModal = document.querySelector('#dialog-app-modal');
	const $page = document.querySelector('.main-wrapper');

	const $countryLoc = document.querySelector('#location-country');
	const $stateLoc = document.querySelector('#location-state');
	const $districtLoc = document.querySelector('#location-district');
	const $roadLoc = document.querySelector('#location-road');


	/*let 
		district = '', 
		state = '', 
		road = '',
		country = '',
		longitude = '',
		latitude = '',
		street = '',
		city = '';*/
	
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

		    if (request.status == 200) { 
		        // Success!
		        let data = JSON.parse(request.responseText);
		        console.log (data);

		        let components = data.results[0].components;
		        // console.log(components);

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

		        // Pass in location details to form
		        $countryLoc.value = country;
		        $stateLoc.value = state;
		        $districtLoc.value = city_district;
		        $roadLoc.value = road;

		    } else if (request.status <= 500){ 
		      // We reached our target server, but it returned an error
		                           
		        console.log("unable to geocode! Response code: " + request.status);
		        let data = JSON.parse(request.responseText);
		        console.log(data.status.message);
		        alert('There is a server error, Please try again later');
		        $page.style.display = 'none';
		        $dialogModal.style.display = 'none';
		    } else {
		        console.log("server error");
		        alert('There is a server error, Please try again later');
		        $page.style.display = 'none';
		        $dialogModal.style.display = 'none';
		    }
		};

		request.onerror = function() {
		    // There was a connection error of some sort
		    console.log("unable to connect to server");        
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

		$appClose.classList.add('allowed');	// enable button interaction if user accepts location sharing

		// Unpack latlong values
		const {latitude, longitude} = position.coords;
		geocode(latitude, longitude);
		
	}

	// If ser declines to share location, interrupt app
	const errorCallback = (error) => {
		console.log(error);
		$page.style.display = 'none';
		$dialogModal.style.display = 'none';
	}
	
	// Get location. 
	async function geolocate () {
		const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
			enableHighAccuracy : true, 	//try best to provide with a high accurate location
			timeout: 5000
		});	
	}

	function closeModal () {
		$appClose.addEventListener('click', () => {
			$dialogModal.classList.add('hide');
		});
	}

	geolocate().then(closeModal());



