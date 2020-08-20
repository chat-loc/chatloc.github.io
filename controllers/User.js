/*********************USER ROUTES***************************/
const express = require('express');
let router = express.Router();

// Import schema
const userModel = require("../models/User");
const loginModel = require("../models/Login");
const chatModel = require("../models/Chat");

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

// Coming from login form
// router.route("/login").post((req, res) => {
router.post("/login", (req, res) => { 

 	// Check if login details exist in DB

 	let name = req.body.params.name;
 	let password = req.body.params.password;

 	// console.log("AXIOS LOGIN: ", name, password);
 	userModel.findOne({name, password}).then(login => {

 		console.log("Login : ", login);

 		if (login) {

 			const loginID = login._id;	// User's ID; not really used for much

 			// User credentials have been checked; first find his origin and sex
 			// from his record in users DB, to be passed to new page.

 			// ORIGIN AND SEX OBTAINED FOR USER HERE
 			userModel.findOne({name, password}, {"origin": 1, "sex": 1}).then((user) => {

 				const { origin, sex } = user;

 				// console.log("origin: " + origin);
 				// console.log("USER'S SEX, ORIGIN: " + user);

				// SAVE THE USER'S RIGHT DETAILS TO THE LOGINDB

				// The countryLoc, stateLoc, districtLoc and roadLoc come from axios 
 				const newUserLocDetails = {
 					name : name,
 					origin : (origin).toLowerCase(),
 					sex : sex,
   					countryLoc: lowerCaseNoSpaces(req.body.params.countryLoc),
   					stateLoc : lowerCaseNoSpaces(req.body.params.stateLoc),
   					districtLoc : lowerCaseNoSpaces(req.body.params.districtLoc),
   					roadLoc : lowerCaseNoSpaces(req.body.params.roadLoc)
 				}	

 				console.log("NEW USER LOCDETAILS : ", newUserLocDetails);

 				// Unpack this, for use in fetching users from the same district.
 				const districtLoc = newUserLocDetails.districtLoc;

 				const loginDB = new loginModel(newUserLocDetails);	// the 'new' keyword when its time to save

					// SINCE LOGOUT FUNCTIONALITY HAS NOT BEEN CREATED YET, ANY LOGIN KEEPS
					// UNNECESSARILY ADDING TO THE DB
					loginModel.findOne({name, password}).then(login =>  {
				        if (user) {	// Use 'user' instead of 'login' because 'user' contains password and not login
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

		    	// console.log("ORIGIN & DISTRICT BEFORE FETCHING 10 USERS FROM SAME ORIGIN & DISTRICT", origin, districtLoc);

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
 			res.json({loginFail: "Wrong Login Credentials"})

 		}

 	})

});

router.post("/chatroom", (req, res) => {

	const room = req.body.params.room;

	// log("---Chatroom : ", room);

	// 1e. Now load the chats for your own interface. 'You' don't need to load chats for 
	// the others because the code will be personalised for them too. Thus, as you're the
	// user now, so they are on their machine. 

	chatModel.find({room}, function(err, chats) {
	    if (err) {
	        throw err;
	    }

	    if (chats) {

	    	console.log("---Load old messages for newly joined user", chats);
	    	/*[ { dateCreated: 2020-08-12T06:50:32.969Z,
	    	    _id: 5f33991968a20d423c818989,
	    	    msg: 'test this',
	    	    room: 'etobicoke-north',
	    	    name: 'andrea',
	    	    __v: 0 },

	    	    ...

	    	]*/
	    	res.json(chats);	// send chats
	    }

	});

});

module.exports = router;