/*********************USER ROUTES***************************/
const express = require('express');
let router = express.Router();
const session = require('express-session');

// Import schema
const userModel = require("../models/User");
const loginModel = require("../models/Login");

// Function to check for nulls
const checkNull = (key, field, errors, loginVals) => {
    (field == "") ? errors.noll[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
};

const capitalise = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

// Session middleware
router.use(session({
    name : 'sid',
    resave : false,
    saveUninitialized : false,
    secret : 'chat-loc-2020-07-22',
    cookie : {
        maxAge : 1000 * 60 * 60 * 10,
        sameSite : true,
        secure : false
    }
}));

// Require auth on roomlist page
const redirectLogin = (req, res, next) => {
    if (!req.session.userDetails) {  // User not logged in
        res.redirect('/user/login');
    } else {
        next();
    }
}

// Requrie auth on reg/login pages
const redirectHome = (req, res, next) => {
    if (req.session.userDetails) {  // User not logged in
        res.redirect('/user/roomlist');
    } else {
        next();
    }
}

router.get("/roomlist", redirectLogin, (req, res) => {
	
	// console.log(req.session);
	// If no session is set at all (evidence of login / registration), then reroute
	const { userDetails, filteredOrigin, filteredDistrict } = req.session;

	if (userDetails || filteredOrigin || filteredDistrict) {
		res.render("General/roomlist", {
			userDetails,
			filteredOrigin,
			filteredDistrict,
			page : "roomlist"
		});
	} else {
		res.redirect("/user/login");
	}

});

//Route to direct use to Registration form
router.get("/registration", /*redirectHome,*/ (req, res) => {
    res.render("User/registration", {
    	page : "form"
    });
});

//Route to direct use to Registration form
router.get("/login", redirectHome, (req, res) => {
    res.render("User/login", {
    	page : "form"
    });
});

//Route to process user's request and data when user submits registration form
router.post("/registration", redirectHome, (req, res) => {

	// Create object to hold errors
	/*
	What errors object will eventual ly look like: 
	errors = {
	    noll : {name : true, lastName : true}
	    regex : {password : 'Should be more than 0 character long'}
	}
	*/
	let errors = {
	    noll : {},
	    regex : {}
	};
	let loginVals = {};
	let formValid = true;

	// console.log(req.body);

	let name = ((req.body.name).trim()).toLowerCase();
	let email = (req.body["email"]).trim();
	let password = (req.body["password"]);
	let sex = (req.body["sex"]);

	const regexMail = new RegExp(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+/);  // kodesektor@rocketmail.com
	const regexLettersNos = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/); 

	// Stage 1: Check for nulls
	const checkLength = (key, field, msg) => {
	    if (field.length < 1 || field.length > 20) {
	        errors.regex[`${key}`] = msg;
	    }
	}  

	const checkRegexLettersNos = (key, field, pattern, msg) => {
	    if (!pattern.test(field)) {
	        errors.regex[`${key}`] = msg;
	    }
	}

	checkNull ("name", name, errors, loginVals);
	checkNull ("email", email, errors, loginVals);
	checkNull ("password", password, errors, loginVals);
	checkNull ("sex", sex, errors, loginVals);

	// Check for mail regex
	const checkRegexMail = (key, field, pattern, msg) => {
	    if (!pattern.test(field)) {
	        errors.regex[`${key}`] = msg;
	    }
	}

	// If errors for invalid patterns exist, re-render route to referring page and export errors object
	if (Object.keys(errors.noll).length > 0) {
	    formValid = false;

	    res.render('User/registration', {
	        errors : errors.noll,
	        loginVals,
	        form : "form"
	    });

	} else {

        // STAGE 2:

        // Check password length and pattern
        checkLength ("passwordLength", password, "Password should be between 6 and 12 characters");

        // Check for valid mail
        checkRegexMail ("mailRegex", email, regexMail, "Mail address is invalid");

        // Check for combination of uppercase, lowercase and required nos
        checkRegexLettersNos ("accountPasswordMix", password, regexLettersNos, "Mix of uppercase, lowercase and numbers required");

        // If errors for invalid patterns exist, re-render route to referring page and export errors object
        if (Object.keys(errors.regex).length > 0) {
            formValid = false;
            res.render("User/registration", {
                errors : errors.regex,
                loginVals,
                form : "form"
            });
        } 
    }

    if (formValid) {

    	/*REQUIREMENTS:

			Name, sex and origin for user
			Name, sex, origin, and location details for other loggedin users
    	*/

    	// console.log(req.body);

    	// Fetch user details from body object
    	const newUser = {
    		name : ((req.body.name).trim()).toLowerCase(), 
    		email : (req.body.email).trim(),
    		password : req.body.password,
    		origin : req.body.origin,
    		sex : req.body.sex
    		/*countryLoc: req.body["location-country"],
    		stateLoc : req.body["location-state"],
    		districtLoc : req.body["location-district"],
    		roadLoc : req.body["location-road"]*/
    	}

    	const newUserLocDetails = {
    		name : ((req.body.name).trim()).toLowerCase(), 
    		origin : req.body.origin,
    		sex : req.body.sex,
    		countryLoc: 'Canada',
    		stateLoc : 'Ontario',
    		districtLoc : 'Etobicoke North',
    		roadLoc : 'Foxchase Ave'

    		// DON'T FORGET TO MAKE LOCS DYNAMIC
    	}

    	const {name, sex, origin } = newUser;
    	const districtLoc = newUserLocDetails.districtLoc;

    	// FIRST SAVE ONLY MINIMUM DATA TO USERS DATABASE (WITHOUT THE LOC DETAILS)
    	const user = new userModel(newUser);
    	user.save().then(() => {
    		// Set the session right now after database insertion
    		req.session.userId = name;

    	}).catch(err => console.log(`Error while inserting into the data ${err}`));

		// THEN SAVE TO LOGIN DATABASE (esp.the location details)
		const login = new loginModel(newUserLocDetails);

		login.save().then(() => {

			/*console.log ("user :" + user);
			console.log("origin :" + origin);*/

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

				req.session.userDetails = { name, sex, origin, districtLoc };	// User Details
				req.session.filteredOrigin = filteredOrigin;		// 10 users in same origin
				req.session.filteredDistrict = filteredDistrict;	// 10 users in same district

				return res.redirect('/user/roomlist');

			});

		});

	}
 
});

// Coming from login form
router.post("/login", (req, res) => { 

	// Fetch the details
	const name = ((req.body.name).trim()).toLowerCase();
	const password = req.body.password;
	let insertedRec = false;

	// Create object to hold errors
	let errors = {
	    noll : {},
	    server : {},
	    regex : {}
	};
	let loginVals = {};
	let formValid = false;

	// Check if user enters nothing
	checkNull ("name", name, errors, loginVals);
	checkNull ("password", password, errors, loginVals);

	// If errors for invalid patterns exist, re-render route to referring page and export errors object
	if (Object.keys(errors.noll).length > 0) {
	    formValid = false;

	   /* console.log(errors);
	    console.log(loginVals);*/

	    res.render('User/login', {
	        errors : errors.noll,
	        loginVals,
	        page : "form"
	    });

	    console.log(errors);

	}    // Otherwise redirect (and reload) Home page
     else {

    	/*REQUIREMENTS:

			Name, sex and origin for user
			Name, sex, origin, and location details for other loggedin users
    	*/

     	// Check if login details exist in DB
     	loginModel.findOne({
     		name : name,
     		password : password

     	}, function (err, login) {	// Login unsuccessful

     		if (err) {
     			console.log("In DB");
     			console.log (err);
     			res.render('User/login', {
     			    errors : errors.server,
     			    loginVals,
     			    page : "form"
     			});

     		} else {	// Login successful 

     			if (!login) {
     				insertedRec = true;
     			}

     			console.log("Not In DB");

     			// User credentials have been checked; first find his origin and sex
     			// from his record in users DB, to be passed to new page.

     			// ORIGIN AND SEX OBTAINED FOR USER HERE
     			userModel.findOne({name, password}, {"origin": 1, "sex": 1}).then((user) => {

     				const { origin, sex } = user;

     				/*console.log("origin: " + origin);
     				console.log("user: " + user);
*/
     				// SAVE THE USER'S RIGHT DETAILS TO THE LOGINDB
     				const newUserLocDetails = {
     					name : name,
     					origin : origin,
     					sex : sex,
     					countryLoc: 'Canada',
     					stateLoc : 'Ontario',
     					districtLoc : 'Etobicoke North',
     					roadLoc : 'Mercury Road'     					
     				}	

     				// DON'T FORGET TO MAKE LOCS DYNAMIC

     				// Unpack this, for use in fetching users from the same district.
     				const districtLoc = newUserLocDetails.districtLoc;

     				const loginDB = loginModel(newUserLocDetails);
     				
 					if (!insertedRec) {
 						loginDB.save().then(() => {
 							console.log('Record Saved');
 						});
 					}


					// NOW LOOP THROUGH ALL USERS FROM THE SAME ORIGIN AND SEND TO ROOMLIST PAGE

				    // The login form has no input for origin and it makes no sense since the 
				    // user has once filled it in the registration form. However, the 
				    // origin value is paramount as it is necessary to send the user to the 
				    // right room. 

				    // If the user is trying to log in, he must have registered. Compare his 
				    // login details to his registration details to retrieve his 'origin'

				    
			    	// Fetch 10 loggedin users from same origin

			    	// console.log(origin);

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

						// console.log(filteredOrigin);

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

							req.session.userDetails = { name, sex, origin, districtLoc };	// User Details
							req.session.filteredOrigin = filteredOrigin;		// 10 users in same origin
							req.session.filteredDistrict = filteredDistrict;	// 10 users in same district

							return res.redirect('/user/roomlist');

						});

					});
     			
 			  	}).catch(err => console.log(`Error while inserting into the data ${err}`));

     		}

     	});        
    }

});

// DON'T FORGET TO REMOVE REDIRECTLOGIN

router.get("/etobicoke-north-room", redirectLogin, (req, res) => {
	// console.log(req.session) There is still access to 
	// Session either get or post. (So there may be no need for query strings)
	const { userDetails, filteredOrigin, filteredDistrict } = req.session;
	/*console.log (req.session);
	console.log ("userDetails : " + userDetails);*/
	res.render("User/etobicoke-north-room", {
		user: userDetails.name,
		filteredOrigin,
		filteredDistrict,
		page : "chatroom",
		room : "etobicoke-north-room",

	});
});

router.get("/italy", (req, res) => {
	res.render("User/italy", {
		page : "chatroom"
	});
});

router.get("/india", (req, res) => {
	res.render("User/india", {
		page : "chatroom"
	});
});

router.get("/nigeria", (req, res) => {
	res.render("User/nigeria", {
		page : "chatroom"
	});
});


module.exports = router;