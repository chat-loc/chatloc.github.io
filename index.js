const express = require("express");
const exphbs  = require('express-handlebars');

// Add body parser to process form data 
const bodyParser = require('body-parser');

const product = require("./models/user");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));


app.use((req, res, next) => {
    next(); 
})

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render("registration.html", {
        title : "Registration Page"
    });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`The webserver is up and running`);
});