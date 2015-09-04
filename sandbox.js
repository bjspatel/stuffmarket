// var mongoose = require("mongoose");
var User = require("./app/models/user");
var passport = require("passport");
var authCtrl = require("./app/controllers/db/authentication-controller")(passport);

// mongoose.connect("mongodb://localhost:27017/stuffmarket");
require("./app/controllers/auth/passport.js")(passport, req, res);

var req = {
        body: {
            userName: "bjs.patel28",
            userFirstName: "Brijesh",
            userLastName: "Patel",
            userPassword: "pwd",
            userLocationName: "Ramesh Nagar",
            userLocationCoordinates: [28.6530, 77.1315]
        }
    },
    res = {},
    next = function() {
        return undefined;
    };

// authCtrl.signup(req, res, next);
authCtrl.signin(req, res, next);


var newUser = new User();
newUser.getUser(req, res, next)
.tap(console.log);


// var newUser = new User();
// newUser.addUser(req, res, next)
// .tap(console.log)
// .spread(brijesh.getUser)
// .tap(console.log)
// .catch(console.log);

// brijesh.save(function(err) {
//     if(err) {
//         throw err;
//     }
//     console.log("User saved successfully");
//     User.find({}, function(err, users) {
//         if(err) {
//             throw err;
//         }
//         console.log(users);
//     });
// });
