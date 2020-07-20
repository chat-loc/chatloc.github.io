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

	let name = req.body.name;
	let password = req.body.password;

	console.log(req.body);

	/*const newLogin = {
		name : req.body.name, 
		password : req.body.password
	}*/

	// const login = new loginModel(newLogin);

	loginModel.findOne({
		name : name,
		password : password
	}, function (err, login) {

		if (err || !login) {
			console.log (err);
			res.redirect("/user/login")
		} else {
			res.redirect("/");
		}

	});

	login.save().then(() => {
		res.redirect("/")
	}).catch(err => console.log(`Error while inserting into the data ${err}`));
 
});

//Route to direct user to edit task form

router.get("/edit/:id", (req, res) => {
	
	// params.id catches the id passed from the click of 'Edit'
	// which is the last part of the URL (http://localhost:3003/task/edit/5f083f597f2810924c9d0985)
	taskModel.findById(req.params.id).then((task) => {

		const {_id, title, description, dueDate, priority, status} = task;

		res.render("Task/taskEditForm", {
			_id, title, description, dueDate, priority, status
		})

	})

});

module.exports = router;