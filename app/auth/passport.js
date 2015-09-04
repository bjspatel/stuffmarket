var LocalStrategy   = require("passport-local").Strategy,
    FBStrategy      = require("passport-facebook").Strategy,
    bcrypt          = require("bcrypt-nodejs"),
    User            = require("../models/user");

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
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				process.nextTick(function() {
					new User({email: email})
					.fetch()
					.then(function(fetchedUser) {
						if(fetchedUser) {
							return done(null, false, {responseCode: 409, message: "The user '" + email + "' already exists."});
						} else {
							//create a new user
                            dbWorker.addEntity()
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
				usernameField: "userUserName",
				passwordField: "userPassword",
				passReqToCallback: true
			},
			function(req, userName, password, done) {
				new User({username: userName})
				.fetch()
				.then(function(data) {
					var user = data;
					if(!user) {
						//user does not exist
						return done(null, false, {responseCode: 404, message: "User '" + userName + "' does not exist."});
					} else {
						user = data.toJSON();
						if(!bcrypt.compareSync(password, user.password)) {
							//user is found, but password is incorrect
							return done(null, false, {responseCode: 401, message: "Password is incorrect."});
						} else {
							//return found user
							return done(null, user, {responseCode: 200, message:"User '" + userName + "' signed in successfully."});
						}
					}
				})
				.catch(function(error) {
					console.trace("Error while loading user: " + JSON.stringify(error));
				});
			}
		)
	);

    passport.use(
        "facebook-auth",
        new FBStrategy({
        clientId: config.fb.appId,
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
};
