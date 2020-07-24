const express = require('express');
const router = express.Router();


/*GENERAL ROUTES*/

//Route to direct user to roomlist page
router.get("/", (req, res) => {
    /*res.render("General/roomlist");*/
    res.redirect("/user/login");
});

/*//Route to direct user to chat app
router.get("/", (req, res) => {
    res.render("General/roomlist");
    res.redirect("/user/login");
});*/


module.exports = router;