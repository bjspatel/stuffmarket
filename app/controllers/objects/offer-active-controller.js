var OfferActive     = require("../../models/offer-active"),
    restUtil        = require("../rest/rest-util"),
    url             = require("url"),
    OfferActiveCtrl = {};

OfferActiveCtrl.sendAdd = function(req, res, next) {
    restUtil.sendResponse(req, res, next, OfferActive, "addObject");
};

OfferActiveCtrl.sendUpdate = function(req, res, next) {
    var identifier = { "_id": req.params.offerActiveId };
    restUtil.sendResponse(req, res, next, OfferActive, "updateObject", identifier);
};

OfferActiveCtrl.sendOne = function(req, res, next) {
    var identifier = { "_id": req.params.offerActiveId };
    restUtil.sendResponse(req, res, next, OfferActive, "getObject", identifier);
};

OfferActiveCtrl.sendBid = function(req, res, next) {
    var identifier = { "_id": req.params.offerActiveId };
    restUtil.sendResponse(req, res, next, OfferActive, "updateObject", identifier);
};

OfferActiveCtrl.sendRange = function(req, res, next) {
    var queryObject = url.parse(req.url, true).query;
    var locationParams = { attribute: "location.coordinates", distance: queryObject.distance || 100 };
    restUtil.sendResponse(req, res, next, OfferActive, "getObject", null, locationParams);
};

OfferActiveCtrl.sendAll = function(req, res, next) {
    restUtil.sendResponse(req, res, next, OfferActive, "getObject");
};

OfferActiveCtrl.sendDeleteAll = function(req, res, next) {
    var entity = new OfferActive();
    entity.deleteAll(req, res, next);
};

module.exports = OfferActiveCtrl;
