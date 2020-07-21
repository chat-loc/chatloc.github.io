
	// User accepts to share location
	const successCallback = (position) => {
		console.log(position);
		$appClose.classList.add('allowed');


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
	}

	// User declines to share location
	const errorCallback = (error) => {
		console.log(error);
		$page.style.display = 'none';
		$dialogModal.style.display = 'none';
	}
	
	// Get location
	const geolocate = () => {
		const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
			enableHighAccuracy : true, 	//try best to provide with a high accurate location
			timeout: 5000
		});	
		 //$appClose.classList.add('allowed');	
	}

	async function closeModal () {
		$appClose.addEventListener('click', () => {
			$dialogModal.classList.add('hide');
		});
	}
	
	const $appClose = document.querySelector('#app-alert-close');
	const $dialogModal = document.querySelector('#dialog-app-modal');
	const $page = document.querySelector('.main-wrapper');

	geolocate();



