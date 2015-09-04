var mongoose    = require("../db/mongoose"),
    bcrypt      = require("bcrypt-nodejs"),
    dbWorker    = require("../controllers/objects/db-worker"),
    userSchema;

userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: { type: String, required: true, unique: true },
    isFacebook: Boolean,
    password: String,
    location: {
      name: String,
      coordinates: { type: [Number], index: "2dsphere" }
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password);
    }
    return next();
});

var User = mongoose.model("User", userSchema);

User.prototype.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        callback(null, isMatch);
    });
};

User.prototype.addObject = function(req, res, next, lastModel) {
    return dbWorker.addDataObject([req, res, next, lastModel], User);
};

User.prototype.updateObject = function(req, res, next, identifier) {
    return dbWorker.updateDataObject([req, res, next, identifier], User);
};

User.prototype.getObject = function(req, res, next, identifier, locationParams) {
    return dbWorker.getDataObject([req, res, next, identifier], User, locationParams);
};

User.prototype.deleteAll = function(req, res, next) {
    dbWorker.getDataObject([req, res, next], User)
    .spread(function (req, res, next, result) {
        console.log(result);
        for(var i=0; i<result.length; i++) {
            result[i].remove();
        }
        res.status(200).end("All users deleted");
    });
};

module.exports = User;
