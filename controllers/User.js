/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
// Import schema
const userModel = require("../models/User");

//Route to direct use to Registration form
router.get("/registration", (req, res) => {
    res.render("User/registration");
});

//Route to process user's request and data when user submits registration form
router.post("/registration", (req, res) => { 

	const newUser = {
		name : req.body.name, 
		email : req.body.email,
		password : req.body.password,
		origin : req.body.origin,
		sex : req.body.sex
	}

	const user = new userModel(newUser);
	user.save().then(() => {
		res.redirect("/")
	}).catch(err => console.log(`Error while inserting into the data ${err}`));
 
});

router.post("/login", (req, res) => { 

	// Function to check for nulls
	const checkNull = (key, field, errors, loginVals) => {
	    (field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
	};

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

	    console.log(errors);
	    console.log(loginVals);

	    res.render('User/login', {
	        errors : errors.null,
	        loginVals,
	        errorClass : {active: "active"},
	    });

	}    // Otherwise redirect (and reload) Home page
     else {
     	console.log(errors);

     	// Check if login details exist in DB
     	userModel.findOne({

     		name : name,
     		password : password

     	}, function (err, login) {

     		if (err || !login) {
     			console.log (err);
     			res.render('User/login', {
     			    errors : errors.null,
     			    loginVals,
     			    errorClass : {active: "active"},
     			});
     		} else {
     			console.log ('Login successful');
     			res.redirect("/");
     		}

     	});        
    }

});

module.exports = router;