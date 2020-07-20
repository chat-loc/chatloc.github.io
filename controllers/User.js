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

	console.log(req.body);

	const user = new userModel(newUser);
	user.save().then(() => {
		res.redirect("/")
	}).catch(err => console.log(`Error while inserting into the data ${err}`));
 
});


//Route to direct use to Registration form
router.get("/login", (req, res) => {
    res.render("User/login");
});

module.exports = router;