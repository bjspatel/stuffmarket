var express 		= require("express"),
	app 	   		= express(),
	path			= require("path"),
	http			= require("http"),
	passport 		= require("passport"),
	flash 			= require("connect-flash"),

	morgan			= require("morgan"),
	cookieParser	= require("cookie-parser"),
	bodyParser		= require("body-parser"),
	session			= require("express-session"),

	config 			= require("./config/development"),
	port			= config.port;

//-------------------------setup the express application----------------------------\\

app.use(morgan("dev"));				//logs every request to console
app.use(cookieParser());			//use cookie - needed for auth
app.use(bodyParser.json() );		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({		// to support URL-encoded bodies
	extended: true
}));

app.use(session({secret:config.sessionSecret, resave: true, saveUninitialized: true}));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

//-----------------------initialize and configure passport--------------------------\\
require("./app/controllers/auth/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());
require("./app/routes/routes.js")(express, app, passport);

//---------------------------------start server-------------------------------------\\
app.listen(config.port, function() {
	console.log("Server is running on port " + config.port);
});
