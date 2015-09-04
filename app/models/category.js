var mongoose = require("mongoose"),
    restUtil    = require("../controllers/rest/rest-util"),
    dbWorker    = require("../controllers/objects/db-worker");

var categorySchema = new mongoose.Schema({
    name: String,
    description: String
});

var Category = mongoose.model("Category", categorySchema);

Category.prototype.addObject = function(req, res, next, lastModel) {
    return dbWorker.addDataObject([req, res, next, lastModel], Category);
};

Category.prototype.updateObject = function(req, res, next, lastModel) {
    var identifier = { "_id": req.params.categoryId };
    return dbWorker.updateDataObject([req, res, next, identifier], Category);
};

Category.prototype.getObject = function(req, res, next, identifier) {
    return dbWorker.getDataObject([req, res, next, identifier], Category);
};

Category.sendAdd = function(req, res, next) {
    restUtil.sendResponse(req, res, next, Category, "addObject");
};

Category.sendUpdate = function(req, res, next) {
    var identifier = { "_id": req.params.categoryId };
    restUtil.sendResponse(req, res, next, Category, "updateObject", identifier);
};

Category.sendOne = function(req, res, next) {
    var identifier = { "_id": req.params.categoryId };
    restUtil.sendResponse(req, res, next, Category, "getObject", identifier);
};

Category.sendAll = function(req, res, next) {
    restUtil.sendResponse(req, res, next, Category, "getObject");
};

module.exports = Category;
