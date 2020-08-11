/*********************USER ROUTES***************************/
const express = require('express');
let router = express.Router();

// Import schema
const userModel = require("../models/User");
const loginModel = require("../models/Login");

const capitalise = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

const lowerCaseNoSpaces = (input) => {
	return ((input).toLowerCase()).replace(" ", "-");
}

// "etobicoke-north" => "Etobicoke North" (Used for the heading in the chatroom)
const upperCaseSomeSpaces = (input) => {
    let val = (input).split('-');
    val.forEach((elm, index, theArray)=> {
        theArray[index] = capitalise(elm);
    });
    return val.join(" ");
}

/*
	UNDERSTANDING THE PARAMETERS PASSED IN THE ROUTERS

	1. userDetails: Contains name, sex, origin, districtLoc, saved in a session. DistrictLoc will be used to 
		create button leading to District room. While origin, to create button leading to Origin room. Both in
		"roomlist" page.

	2. filteredOrigin: Fetched users (from login DB) who share the same origin as user and the details fetched 
		are : id, name, origin, sex, countryLoc, stateLoc, districtLoc, and roadLoc. Also saved in a session.
		Will be used to display a list of name, sex and road of users who share the same origin in "roomlist" page

	3. filteredDistrict: Fetched users (from login DB) who share the same district as user (not necessarily the 
		origin) and the details fetched are: id, name, origin, sex, countryLoc, stateloc, districtLoc, roadLoc

	4. page: Used for knowing what stylesheet should be linked to format the appropriate page (on main)
*/


router.get("/[A-Za-z-.]+-district-room$/", (req, res) => {
	// console.log(req.session) There is still access to 
	// Session either get or post. (So there may be no need for query strings)
	const { userDetails, filteredOrigin, filteredDistrict } = req.session;
	/*console.log (req.session);
	console.log ("userDetails : " + userDetails);*/
	res.render("User/chatroom", {
		user: (userDetails.name).toLowerCase(),
		filteredOrigin,
		filteredDistrict,
		page : "chatroom",
		room: (userDetails.districtLoc).toLowerCase(),
		header : upperCaseSomeSpaces(userDetails.districtLoc)
	});
});

router.get("/[A-Za-z-.]+-origin-room$/", (req, res) => {
	// console.log(req.session) There is still access to 
	// Session either get or post. (So there may be no need for query strings)
	const { userDetails, filteredOrigin, filteredDistrict } = req.session;
	/*console.log (req.session);
	console.log ("userDetails : " + userDetails);*/
	res.render("User/chatroom", {
		user: (userDetails.name).toLowerCase(),
		filteredOrigin,
		filteredDistrict,
		page : "chatroom",
		room: (userDetails.origin).toLowerCase(),
		header : upperCaseSomeSpaces(userDetails.origin)
	});
});



//Route to process user's request and data when user submits registration form
router.post("/registration", (req, res) => {

	/*REQUIREMENTS:
		Name, sex and origin for user
		Name, sex, origin, and location details for other loggedin users
	*/

	// console.log("REQ BODY PARAMS: ", req.body.params);

	let loginID = "";

	// Fetch user details from body object
	const newUser = {
		name : ((req.body.params.name).trim()).toLowerCase(),
		password : (req.body.params.password).trim(),
		email : (req.body.params.email).trim(),
		origin : ((req.body.params.origin).trim()).toLowerCase(),
		sex : (req.body.params.sex).trim()
	}

	const newUserLocDetails = {
		name : ((req.body.params.name).trim()).toLowerCase(),
		origin : ((req.body.params.origin).trim()).toLowerCase(),
		sex :(req.body.params.sex).trim(),
		countryLoc: lowerCaseNoSpaces(req.body.params.countryLoc),
		stateLoc : lowerCaseNoSpaces(req.body.params.stateLoc),
		districtLoc : lowerCaseNoSpaces(req.body.params.districtLoc),
		roadLoc : lowerCaseNoSpaces(req.body.params.roadLoc)
	}

	const { name, sex, origin, password } = newUser;
	const districtLoc = newUserLocDetails.districtLoc;

	// FIRST SAVE ONLY MINIMUM DATA TO USERS DATABASE (WITHOUT THE LOC DETAILS)
	const user = new userModel(newUser);

	// SINCE LOGOUT FUNCTIONALITY HAS NOT BEEN CREATED YET, ANY LOGIN KEEPS
	// UNNECESSARILY ADDING TO THE DB
	userModel.findOne({name, password}, function(err, userDoc) {
        if (err) {
        	return res(err);
        }
        if (!userDoc) {
        	user.save().then((savedUser) => {

        		loginID = savedUser._id;

        		// console.log("LOGIN ID : ", loginID);

        		// Set the session right now after database insertion
        		//req.session.userId = name;

        	}).catch(err => console.log(`Error while inserting into the data ${err}`));

        } else {
        	// console.log("User already in DB");

        	res.json({userExists : "User already in database"});
        }
    });

	// THEN SAVE TO LOGIN DATABASE (esp.the location details)
	const login = new loginModel(newUserLocDetails);	// 'new' is only used for saving, not finding

	// SINCE LOGOUT FUNCTIONALITY HAS NOT BEEN CREATED YET, ANY LOGIN KEEPS
	// UNNECESSARILY ADDING TO THE DB
	loginModel.findOne({name, origin}, function(err, userDoc) {
		// console.log("LOGIN MODEL WAS FOUND : ", userDoc);
        if (err) {
        	return res(err);
        }
        if (!userDoc) {
        	// console.log("NAME AND ORIGIN DO NOT EXIST; GO AHEAD TO SAVE");
        	login.save().then(() => {
        		console.log('Record Saved');
        	});
        } else {
        	// console.log("NAME AND ORIGIN EXIST ALREADY");
        }
    });


	// NOW LOOP THROUGH ALL USERS FROM THE SAME ORIGIN AND SEND TO ROOMLIST PAGE

    // The login form has no input for origin and it makes no sense since the 
    // user has once filled it in the registration form. However, the 
    // origin value is paramount as it is necessary to send the user to the 
    // right room. 

    // If the user is trying to log in, he must have registered. Compare his 
    // login details to his registration details to retrieve his 'origin'

    
	// Fetch 10 loggedin users from same origin

	console.log(origin);

	loginModel.find({origin : origin}).limit(10).then((logins) => {

		const filteredOrigin = logins.map(login => {
			return {
				id : login._id,
				name: login.name,
				origin : login.origin, 
				sex : login.sex.charAt(0),
				countryLoc : login.countryLoc,
				stateLoc  : login.stateLoc,
				districtLoc : login.districtLoc,
				roadLoc : login.roadLoc
			}
		});

		// console.log(filteredOrigin);

		// Fetch 10 loggedin users from same district

    	loginModel.find({districtLoc : districtLoc}).limit(10).then((logins) => {

			const filteredDistrict = logins.map(login => {
				return {
					id : login._id,
					name: login.name,
					origin : login.origin, 
					sex : login.sex.charAt(0),
					countryLoc : login.countryLoc,
					stateLoc  : login.stateLoc,
					districtLoc : login.districtLoc,
					roadLoc : login.roadLoc
				}
			});

			const jsonUserDetails = { name, sex, origin, districtLoc, loginID };	// User Details
			const jsonFilteredOrigin = filteredOrigin;		// 10 users in same origin
			const jsonFilteredDistrict = filteredDistrict;	// 10 users in same district

			res.json({
				jsonUserDetails,
				jsonFilteredOrigin,
				jsonFilteredDistrict
			});
		});

	});

});

// Coming from login form
// router.route("/login").post((req, res) => {
router.post("/login", (req, res) => { 

 	// Check if login details exist in DB

 	let name = req.body.params.name;
 	let password = req.body.params.password;

 	console.log("AXIOS LOGIN: ", name, password);

 	userModel.findOne({name, password}).then(login => {

 		//console.log("Login : ", login);

 		const loginID = login._id;	// User's ID; not really used for much

 		if (login) {

 			// User credentials have been checked; first find his origin and sex
 			// from his record in users DB, to be passed to new page.

 			// ORIGIN AND SEX OBTAINED FOR USER HERE
 			userModel.findOne({name, password}, {"origin": 1, "sex": 1}).then((user) => {

 				const { origin, sex } = user;

 				// console.log("origin: " + origin);
 				// console.log("USER'S SEX, ORIGIN: " + user);

				// SAVE THE USER'S RIGHT DETAILS TO THE LOGINDB
 				const newUserLocDetails = {
 					name : name,
 					origin : (origin).toLowerCase(),
 					sex : sex,
   					countryLoc: lowerCaseNoSpaces(req.body.params.countryLoc),
   					stateLoc : lowerCaseNoSpaces(req.body.params.stateLoc),
   					districtLoc : lowerCaseNoSpaces(req.body.params.districtLoc),
   					roadLoc : lowerCaseNoSpaces(req.body.params.roadLoc)
 				}	

 				console.log(newUserLocDetails);

 				// Unpack this, for use in fetching users from the same district.
 				const districtLoc = newUserLocDetails.districtLoc;

 				const loginDB = new loginModel(newUserLocDetails);	// the 'new' keyword when its time to save

					// SINCE LOGOUT FUNCTIONALITY HAS NOT BEEN CREATED YET, ANY LOGIN KEEPS
					// UNNECESSARILY ADDING TO THE DB
					loginModel.findOne({name, password}).then(login =>  {
				        if (user) {
				        	console.log("WON'T SAVE LOGIN BECAUSE IT EXISTS");
				        }
				        if (!user) {
				        	loginDB.save().then(() => {
				        		console.log('Record Saved');
				        	});
				        }
				    });
				
				// NOW LOOP THROUGH ALL USERS FROM THE SAME ORIGIN AND SEND TO ROOMLIST PAGE

			    // The login form has no input for origin and it makes no sense since the 
			    // user has once filled it in the registration form. However, the 
			    // origin value is paramount as it is necessary to send the user to the 
			    // right room. 

			    // If the user is trying to log in, he must have registered. Compare his 
			    // login details to his registration details to retrieve his 'origin'

			    
		    	// Fetch 10 loggedin users from same origin AND in the same district

		    	console.log("ORIGIN & DISTRICT BEFORE FETCHING 10 USERS FROM SAME ORIGIN & DISTRICT", origin, districtLoc);

		    	loginModel.find({origin : origin, districtLoc : districtLoc}).limit(10).then((logins) => {

					const filteredOrigin = logins.map(login => {
						return {
							id : login._id,
							name: login.name,
							origin : login.origin, 
							sex : (login.sex).charAt(0),
							countryLoc : login.countryLoc,
							stateLoc  : login.stateLoc,
							districtLoc : login.districtLoc,
							roadLoc : login.roadLoc
						}
					});

					console.log("LIST OF USERS FROM THE SAME ORIGIN", filteredOrigin);

					// Fetch 10 loggedin users from same district

			    	loginModel.find({districtLoc : districtLoc}).limit(10).then((logins) => {

						const filteredDistrict = logins.map(login => {
							return {
								id : login._id,
								name: login.name,
								origin : login.origin, 
								sex : (login.sex).charAt(0),
								countryLoc : login.countryLoc,
								stateLoc  : login.stateLoc,
								districtLoc : login.districtLoc,
								roadLoc : login.roadLoc
							}
						});

						// console.log(filteredDistrict);
						
						// Fetch 10 loggedin users from same district

						const jsonUserDetails = { name, sex, origin, districtLoc, loginID };	// User Details
						const jsonFilteredOrigin = filteredOrigin;		// 10 users in same origin
						const jsonFilteredDistrict = filteredDistrict;	// 10 users in same district

						res.json({
							jsonUserDetails,
							jsonFilteredOrigin,
							jsonFilteredDistrict
						});

					});
				});
			});


 		} else {
 			// If user's credientials do not exist in database, 
 			// respond with error
 			console.log("Not in DB");

 		}

 	})

});

module.exports = router;