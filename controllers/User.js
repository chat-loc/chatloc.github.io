/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
// Import schema
const userModel = require("../models/User");

//Route to direct use to Registration form
router.get("/registration", (req, res) => {
    res.render("User/registration");
});

module.exports = router;