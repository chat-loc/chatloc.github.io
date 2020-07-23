const express = require('express');
const router = express.Router();
//const session = require('express-session');

/*// Session middleware
const IN_PROD = 'production';

router.use(session({
    name : 'sid',
    saveUninitialized : false,
    secret : 'chat-loc-2020-07-22',
    cookie : {
        maxAge : 1000 * 60 * 60 * 10,
        sameSite : true,
        secure : IN_PROD
    }
}));

const redirectLogin = (req, res, next) => {
	console.log (req.session);
    if (!req.session.userId) {  // User not logged in
        res.redirect('/user/login');
    } else {
        next();
    }
}

// console.log ('Login successful');
// Redirect to roomlist page
router.get("/roomlist", redirectLogin, (req, res) => {
	const { userId } = req.session;
	console.log (req.session);
	if (userId) {
		res.render("General/roomlist");
	} else {
		redirect("/user/login");
	}
});
*/
/*router.get("/roomlist", redirectLogin, (req, res) => {
	console.log(req.session);
	let userDetails = req.session.userDetails

	if (userId == 1) {
		res.render("General/roomlist", {
			...userDetails
		});
	} else {
		redirect("/user/login");
	}
});
*/
/*GENERAL ROUTES*/

//Route to direct user to roomlist page
router.get("/", (req, res) => {
    /*res.render("General/roomlist");*/
    res.redirect("/user/login");
});



module.exports = router;