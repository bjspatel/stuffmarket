var mongoose = require("mongoose");
    dbWorker    = require("../controllers/objects/db-worker");

var offerActiveSchema = new mongoose.Schema({
    price: Number,
    date: { type: Date, default: Date.now },
    item: {
        id: String,
        name: String,
        categoryId: String,
        categoryName: String,
        isService: Boolean
    },
    user: {
        id: String,
        firstName: String,
        lastName: String
    },
    location: {
        name: String,
        coordinates: { type: [Number], index: "2dsphere" }
    },
    bids: Array
});

var OfferActive = mongoose.model("OfferActive", offerActiveSchema);

OfferActive.prototype.addObject = function(req, res, next, lastModel) {
    return dbWorker.addDataObject([req, res, next, lastModel], OfferActive);
};

OfferActive.prototype.getObject = function(req, res, next, identifier, locationParams) {
    return dbWorker.getDataObject([req, res, next, identifier], OfferActive, locationParams);
};

OfferActive.prototype.updateObject = function(req, res, next, lastModel) {
    var identifier = { "_id": req.params.offerActiveId };
    return dbWorker.updateDataObject([req, res, next, identifier], OfferActive);
};

OfferActive.prototype.deleteObject = function(req, res, next, identifier) {
    return dbWorker.deleteDataObject([req, res, next], OfferActive, identifier);
};

OfferActive.prototype.deleteAll = function(req, res, next) {
    dbWorker.getDataObject([req, res, next], OfferActive)
    .spread(function (req, res, next, result) {
        console.log(result);
        for(var i=0; i<result.length; i++) {
            result[i].remove();
        }
        res.status(200).end("All Offer-Active deleted");
    });
};

module.exports = OfferActive;
