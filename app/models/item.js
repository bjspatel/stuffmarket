var mongoose = require("mongoose"),
    restUtil    = require("../controllers/rest/rest-util"),
    dbWorker    = require("../controllers/objects/db-worker");

var itemSchema = new mongoose.Schema({
    categoryId: Number,
    name: String,
    isService: Boolean,
    description: String,
    mustHaveSpecs: Array
});

var Item = mongoose.model("Item", itemSchema);

Item.prototype.addObject = function(req, res, next, lastModel) {
    return dbWorker.addDataObject([req, res, next, lastModel], Item);
};

Item.prototype.updateObject = function(req, res, next, lastModel) {
    var identifier = { "_id": req.params.itemId };
    return dbWorker.updateDataObject([req, res, next, identifier], Item);
};

Item.prototype.getObject = function(req, res, next, identifier) {
    return dbWorker.getDataObject([req, res, next, identifier], Item);
};

Item.sendAdd = function(req, res, next) {
    restUtil.sendResponse(req, res, next, Item, "addObject");
};

Item.sendUpdate = function(req, res, next) {
    var identifier = { "_id": req.params.itemId };
    restUtil.sendResponse(req, res, next, Item, "updateObject", identifier);
};

Item.sendOne = function(req, res, next) {
    var identifier = { "_id": req.params.itemId };
    restUtil.sendResponse(req, res, next, Item, "getObject", identifier);
};

Item.sendAll = function(req, res, next) {
    restUtil.sendResponse(req, res, next, Item, "getObject");
};

module.exports = Item;
