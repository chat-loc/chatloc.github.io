const express = require('express');
const router = express.Router();


/*GENERAL ROUTES*/

//Route to direct user to roomlist page
router.get("/", (req, res) => {
    /*res.render("General/roomlist");*/
    res.redirect("/user/login");
});

//router.get("/[A-Za-z-.]+-district-room$/", (req, res) => {
	
router.get("/etobicoke-north-district-room", (req, res) => {
	// console.log(req.session) There is still access to 
	// Session either get or post. (So there may be no need for query strings)
	const { jsonUserDetails, jsonFilteredOrigin, jsonFilteredDistrict } = req.session;

	res.json({
		jsonUserDetails,
		jsonFilteredDistrict,
		jsonFilteredOrigin,

		user : (jsonUserDetails.name).toLowerCase(),
		room : (jsonUserDetails.origin).toLowerCase(),
		header : (upperCaseSomeSpaces(jsonUserDetails.disttrictLoc))
	});
});

module.exports = router;