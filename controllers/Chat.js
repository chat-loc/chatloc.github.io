
/*********************USER ROUTES***************************/
const express = require('express');
let router = express.Router();
const session = require('express-session');

// Import schema
const chatModel = require("../models/ChatChat


// DON'T FORGET TO REMOVE REDIRECTLOGIN

router.get("/etobicoke-north-room", redirectLogin, (req, res) => {
	// console.log(req.session) There is still access to 
	// Session either get or post. (So there may be no need for query strings)
	const { userDetails, filteredOrigin, filteredDistrict } = req.session;
	/*console.log (req.session);
	console.log ("userDetails : " + userDetails);*/
	res.render("Chat/etobicoke-north-room", {
		user: userDetails.name,
		filteredOrigin,
		filteredDistrict,
		page : "chatroom",
		room : "etobicoke-north-room",

	});
});

router.get("/italy", (req, res) => {
	res.render("Chat/italy", {
		page : "chatroom"
	});
});

router.get("/india", (req, res) => {
	res.render("Chat/india", {
		page : "chatroom"
	});
});

router.get("/nigeria", (req, res) => {
	res.render("Chat/nigeria", {
		page : "chatroom"
	});
});