var User        = require("../../models/user"),
    OfferActive = require("../../models/offer-active"),
    restUtil    = require("../rest/rest-util"),
    url         = require("url"),
    UserCtrl    = {};

UserCtrl.sendOne = function(req, res, next) {
    var identifier = { "_id": req.params.userId };
    restUtil.sendResponse(req, res, next, User, "getObject", identifier);
};

UserCtrl.sendMyProfile = function(req, res, next) {
    var identifier = { "_id": req.user["_id"] };
    restUtil.sendResponse(req, res, next, User, "getObject", identifier);
};

UserCtrl.sendMyOffers = function(req, res, next) {
    var identifier = { "user.id": req.user["_id"] };
    restUtil.sendResponse(req, res, next, OfferActive, "getObject", identifier);
};

UserCtrl.sendRange = function(req, res, next) {
    var queryObject = url.parse(req.url, true).query;
    var locationParams = { attribute: "location.coordinates", distance: queryObject.distance || 100 };
    restUtil.sendResponse(req, res, next, User, "getObject", null, locationParams);
};

UserCtrl.sendAll = function(req, res, next) {
    restUtil.sendResponse(req, res, next, User, "getObject");
};

UserCtrl.sendUpdate = function(req, res, next) {
    var identifier = { "_id": req.params.userId };
    restUtil.sendResponse(req, res, next, User, "updateObject");
};

UserCtrl.sendDeleteAll = function(req, res, next) {
    var entity = new User();
    entity.deleteAll(req, res, next);
};

module.exports = UserCtrl;
