var bcrypt  = require("bcrypt-nodejs");

module.exports = function(passport) {

    /**
     * @function
     * @name signup
     * @description Signs up the user.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    this.signup = function (req, res, next) {

        passport.authenticate('local-signup', function(err, user, info) {
            if (err) return next(err);
            user.spread(function(req, passportRes, next, savedObject) {
                res.status(201).json(savedObject);
            })
            .catch(function(err) {
                var message = err.toString();
                res.status(500).json({
                    message: err.errmsg || "User could not be saved because of internal error."
                });
            })
        })(req, res, next);
    };

    /**
     * @function
     * @name signin
     * @description Signs in user
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    this.signin = function (req, res, next) {

        passport.authenticate('local-signin', function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(info.responseCode).json({
                    message: info.message
                });
            } else {
                // Manually establish the session
                req.login(user, function(err) {
                    if (err) return next(err);
                    return res.status(200).json(user);
                });
            }
        })(req, res, next);
    };

    /**
     * @function
     * @name signout
     * @description Signs out user
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    this.signout = function (req, res, next) {
        req.session.destroy();
        req.logout();
        res.status(200).end();
    };

    return this;
};
