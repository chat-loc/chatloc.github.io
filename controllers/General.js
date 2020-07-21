const express = require('express')
const router = express.Router();

/*GENERAL ROUTES*/

//Route to direct user to roomlist page
router.get("/", (req, res) => {
    res.render("General/roomlist");
});

module.exports = router;