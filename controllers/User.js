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

	const name = req.body.name;
	const password = req.body.password;

	// Check if login details exist in DB

	userModel.findOne({

		name : name,
		password : password

	}, function (err, login) {

		if (err || !login) {
			console.log (err);
			res.redirect("/user/login");
		} else {
			res.redirect("/");
		}

	});

});

module.exports = router;