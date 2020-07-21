

	
	geolocate () => {
		const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
	}

	closeModal () => {
		$appClose.addEventListener('click', () => {
			$dialogModal.classList.add('hide');
		});
	}
	
	const $appClose = document.querySelector('#app-alert-close');
	const $dialogModal = document.querySelector('#dialog-app-modal');




