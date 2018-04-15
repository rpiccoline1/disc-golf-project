// Requiring Express
var express = require("express");
// Requiring Cookie Session
var cookieSession = require("cookie-session");
// Requiring Passport
var passport = require("passport");
// Requiring the models folder for syncing
var db = require("./models");
// Requiring the Passport-setup file
var passportSetup = require("./config/passport-setup")(app, db.UserInfo);
// Requiring Body-parser
var bodyParser = require("body-parser");
// Requiring hbs
var hbs = require("hbs");
// Requiring keys
var keys = require("./config/keys");

// Setting the port number
var PORT = process.env.PORT || 8080;

// Intializing Express
var app = express();

// Setting cookieSession
app.use(cookieSession({
  // Max time before expiration
  // One day
  maxAge: 24 * 60 * 60 * 10000,
  // Encrypting keys
  keys: [keys.session.cookieKey]
}));
// Initializing passport
app.use(passport.initialize());
// Controlling log-ins
app.use(passport.session());

// Serving up the public folder to give static content
app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

// Parse application/JSON
app.use(bodyParser.json());

// Set Handlebars
var exphbs = require("express-handlebars");
// Setting the engine and layout for handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Exposes the registerHelper and registerPartial method from handlebars
hbs.registerPartials(__dirname + '/views/partials');

// Import routes and give the server access to them
require("./routes/auth-routes.js")(app, passportSetup);
require("./routes/html-routes")(app);
require("./routes/course-api-routes.js")(app);
require("./routes/hole-api-routes.js")(app);
require("./routes/userInfo-api-routes.js")(app);
require("./routes/userRound-api-routes.js")(app);

// Syncing the database
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});