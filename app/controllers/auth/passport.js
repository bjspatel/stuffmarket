var LocalStrategy   = require("passport-local").Strategy,
    FBStrategy      = require("passport-facebook").Strategy,
    bcrypt          = require("bcrypt-nodejs"),
    User            = require("../../models/user"),
    config          = require("../../../config/development.json");

module.exports = function (passport, req, res) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    //define local signup strategy
	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "userName",
				passwordField: "userPassword",
				passReqToCallback: true
			},
			function(req, userName, password, done) {
				process.nextTick(function() {

					User.findOne({userName: userName}, function(fetchedUser) {
						if(!!fetchedUser) {
							return done(null, false, {responseCode: 409, message: "The user '" + email + "' already exists."});
						} else {
							//create a new user
                            var userPromise = new User().addObject(req, res, done);
                            done(null, userPromise);
						}
					});
                });
            }
		)
	);

    //define local signin strategy
	passport.use(
		"local-signin",
		new LocalStrategy(
			{
				usernameField: "userName",
				passwordField: "userPassword",
				passReqToCallback: true
			},
			function(req, userName, password, done) {

                User.findOne({userName: userName}, function(error, fetchedUser) {
                    if(!!error) {
    					console.trace("Error while loading user: " + JSON.stringify(error));
                        return done(null, false, {responseCode: 500, message: "Error occurred while loading user '" + userName + "'."});
    				} else if(!fetchedUser) {
						//user does not exist
                        console.log("User '" + userName + "' does not exist.");
						return done(null, false, {responseCode: 404, message: "User '" + userName + "' does not exist."});
					} else {
                        fetchedUser = fetchedUser.toObject();
						if(!bcrypt.compareSync(password, fetchedUser.password)) {
							//user is found, but password is incorrect
                            console.log("Password is incorrect.");
							return done(null, false, {responseCode: 401, message: "Password is incorrect."});
						} else {
							//return found user
							return done(null, fetchedUser, {responseCode: 200, message:"User '" + userName + "' signed in successfully."});
						}
					}
				});
			}
		)
	);

    passport.use(
        "facebook-auth",
        new FBStrategy({
        clientID: config.fb.appId,
        clientSecret: config.fb.secret,
        callbackURL: config.fb.callbackURL,
        profileFields: ["id", "first_name", "last_name"]
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({"userId": profile.id}, function(err, fetchedUsers) {
            if(fetchedUsers) {
                done(null, fetchedUsers);
            } else {
                var newUser = new User({
                    userId: profile.id,
                    firstName: profile.first_name,
                    lastName: profile.last_name
                });
                newUser.save(function(err) {
                    if(!err) {
                        done(null, newUser);
                    }
                });
            }
        })
    }));
}
