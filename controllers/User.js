/*********************USER ROUTES***************************/
const express = require('express');
let router = express.Router();
const session = require('express-session');

// Import schema
const userModel = require("../models/User");
const loginModel = require("../models/Login");

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

const redirectLogin = (req, res, next) => {
    if (!req.session.userDetails) {  // User not logged in
        res.redirect('/user/login');
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
	// console.log(req.session)
    if (req.session.userDetails) {  // User not logged in
        res.redirect('/user/roomlist');
    } else {
        next();
    }
}

// Function to check for nulls
const checkNull = (key, field, errors, loginVals) => {
    (field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
};

router.get("/roomlist", /*redirectLogin,*/ (req, res) => {
	const { userId, userDetails } = req.session;
	
/*	console.log ("userId: " + userId);
	if (userId) {
		res.render("General/roomlist", {
			...userDetails
		});
	} else {
		res.redirect("/user/login");
	}*/

	res.render("General/roomlist", {
		...userDetails
	});

});

//Route to direct use to Registration form
router.get("/registration", /*redirectHome,*/ (req, res) => {
    res.render("User/registration");
});

//Route to direct use to Registration form
router.get("/login", /*redirectHome,*/ (req, res) => {
    res.render("User/login");
});

//Route to process user's request and data when user submits registration form
router.post("/registration", (req, res) => {

	// Create object to hold errors
	/*
	What errors object will eventual ly look like: 
	errors = {
	    null : {name : true, lastName : true}
	    regex : {password : 'Should be more than 0 character long'}
	}
	*/
	let errors = {
	    null : {},
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
	if (Object.keys(errors.null).length > 0) {
	    formValid = false;

	    res.render('User/registration', {
	        errors : errors.null,
	        loginVals,
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
                loginVals
            });
        } 
    }

    if (formValid) {

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
    	}

    	const origin = req.body.origin;

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
					sex : login.sex,
					countryLoc : login.countryLoc,
					stateLoc  : login.stateLoc,
					districtLoc : login.districtLoc,
					roadLoc : login.roadLoc
				}
			});

			console.log(filteredOrigin);

			// Fetch 10 loggedin users from same district

			let userFinal = {...newUser, origin}

			req.session.userDetails = userFinal;

			return res.redirect('/user/roomlist');

		});

	}
 
});

// Coming from login form
router.post("/login", (req, res) => { 

	// Fetch the details
	const name = (req.body.name).trim();
	const password = req.body.password;

	// Create object to hold errors
	let errors = {
	    null : {},
	    regex : {}
	};
	let loginVals = {};
	let formValid = false;

	// Check if user enters nothing
	checkNull ("name", name, errors, loginVals);
	checkNull ("password", password, errors, loginVals);

	// If errors for invalid patterns exist, re-render route to referring page and export errors object
	if (Object.keys(errors.null).length > 0) {
	    formValid = false;

	   /* console.log(errors);
	    console.log(loginVals);*/

	    res.render('User/login', {
	        errors : errors.null,
	        loginVals,
	    });

	}    // Otherwise redirect (and reload) Home page
     else {
     	// console.log(errors);

     	// Check if login details exist in DB
     	userModel.findOne({
     		name : name,
     		password : password

     	}, function (err, login) {	// Login unsuccessful

     		if (err || !login) {
     			console.log (err);
     			res.render('User/login', {
     			    errors : errors.null,
     			    loginVals,
     			});
     		} else {	// Login successful 

     			// User credentials have been checked; first find his origin and sex
     			// from his record in users DB, to be passed to new page.

     			userModel.findOne({name, password}, {"origin": 1, "sex": 1}).then((user) => {

     				const { origin, sex } = user;

     				console.log("origin: " + origin);
     				console.log("user: " + user);

     				// SAVE THE RIGHT USER'S DETAILS TO THE LOGINDB
     				const newUserLocDetails = {
     					name : name,
     					origin : origin,
     					sex : sex,
     					countryLoc: 'Canada',
     					stateLoc : 'Ontario',
     					districtLoc : 'Etobicoke North',
     					roadLoc : 'Mercury Road'     					
     				}	// dont forget to make these locdetails dynamic


     				const login = loginModel(newUserLocDetails);

     				login.save().then(() => {

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
									sex : login.sex,
									countryLoc : login.countryLoc,
									stateLoc  : login.stateLoc,
									districtLoc : login.districtLoc,
									roadLoc : login.roadLoc
								}
							});

							console.log(filteredOrigin);

							// Fetch 10 loggedin users from same district

							let userFinal = {...newUser, origin}

							req.session.userDetails = userFinal;

							return res.redirect('/user/roomlist');

						});

     				});
     			
 			  	}).catch(err => console.log(`Error while inserting into the data ${err}`));

     		}

     	});        
    }

});

module.exports = router;