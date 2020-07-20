/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
// Import schema
const loginModel = require("../models/Login");

//Route to direct use to login form
router.get("/login", (req, res) => {
    res.render("User/login");
});

//Route to process user's request and data when user submits login form
router.post("/login", (req, res) => { 

	console.log(req.body);

	const newLogin = {
		name : req.body.name, 
		password : req.body.password
	}

	const login = new loginModel(newLogin);
	login.save().then(() => {
		res.redirect("/")
	}).catch(err => console.log(`Error while inserting into the data ${err}`));
 
});

module.exports = router;