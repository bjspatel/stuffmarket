var mongoose    = require("mongoose"),
    restUtil    = require("../controllers/rest/rest-util"),
    dbWorker    = require("../controllers/objects/db-worker"),
    OfferActive = require("./offer-active");

var offerArchiveSchema = new mongoose.Schema({
    userId: String,
    price: Number,
    date: { type: Date, default: Date.now },
    item: {
        id: String,
        specs: Object
    },
    buyingData: {
        isBought: Boolean,
        buyerId: String,
        archivedDate: { type: Date, default: Date.now },
        buyingPrice: Number
    }
});

var OfferArchive = mongoose.model("OfferArchive", offerArchiveSchema);

OfferArchive.prototype.archiveObject = function(req, res, next, lastModel) {
    var identifier = { "_id": req.params.offerActiveId };
    var archive = this;
    return dbWorker.deleteDataObject([req, res, next], OfferActive, identifier)
        .spread(function(req, res, next, offerActive) {
            var newObject = archive.transform(offerActive);
            return dbWorker.addDataObject([req, res, next, lastModel], OfferArchive, newObject);
        });
};

OfferArchive.prototype.transform = function(activeObj) {
    var archiveObj                  = {};
    archiveObj.userId               = activeObj.user.id;
    archiveObj.price                = activeObj.price;

    archiveObj.item                 = {};
    archiveObj.item.id              = activeObj.item.id;
    archiveObj.item.specs           = activeObj.item.specs;

    return archiveObj;
};

OfferArchive.prototype.updateObject = function(req, res, next, lastModel) {
    var identifier = { "_id": req.params.offerArchiveId };
    return dbWorker.updateDataObject([req, res, next, identifier], OfferArchive);
};

OfferArchive.prototype.getObject = function(req, res, next, identifier) {
    return dbWorker.getDataObject([req, res, next, identifier], OfferArchive);
};

OfferArchive.sendArchive = function(req, res, next) {
    restUtil.sendResponse(req, res, next, OfferArchive, "archiveObject");
};

OfferArchive.sendUpdate = function(req, res, next) {
    var identifier = { "_id": req.params.OfferArchiveId };
    restUtil.sendResponse(req, res, next, OfferArchive, "updateObject", identifier);
};

OfferArchive.sendOne = function(req, res, next) {
    var identifier = { "_id": req.params.OfferArchiveId };
    restUtil.sendResponse(req, res, next, OfferArchive, "getObject", identifier);
};

OfferArchive.sendAll = function(req, res, next) {
    restUtil.sendResponse(req, res, next, OfferArchive, "getObject");
};

module.exports = OfferArchive;
