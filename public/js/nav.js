   	
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FyeW91cmRheSIsImEiOiJja2Npb2JoM2wwYnFkMnFvNWJmYzF2ZGN6In0.vJd1qEXRZXV8tNuwo1l4LQ';

	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
		center: [-79.5132, 43.6205], // starting position
		zoom: 13 // starting zoom
	});

	// Make the links operable
	const stripLinkSpace = (query) => {

		const $query = document.getElementById(query);	// select link
		$queryHref = (($query.href).toLowerCase()).trim();	// remove outer spaces
		$queryHref = $queryHref.replace('%20', '-');	// replace inner spaces with hyphen

		$query.href = $queryHref;	
	}

	stripLinkSpace ('districtLink');
	stripLinkSpace ('chatroomLink');