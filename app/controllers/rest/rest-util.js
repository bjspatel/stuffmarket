var restUtil = {};

restUtil.sendResponse = function(req, res, next, Model, action, identifier, locationParams) {
    var entity = new Model();
    entity[action](req, res, next, identifier, locationParams)
    .spread(function(req, res, next, entityObject) {
        res.status(200).json(entityObject);
    });
};

module.exports = restUtil;
