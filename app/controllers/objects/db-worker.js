var worker      = {},
    Promise     = require("bluebird"),
    fs          = require("fs"),
    url         = require("url");

worker.prepareSchemaObject = function(entityName) {
    var entityMetadata  = require("../metadata/" + entityName + ".json");

    for(var uiName in entityMetadata) {
        var dbName = entityMetadata[uiName]["dbName"];
        var type = entityMetadata[uiName]["type"];
        dbObject[dbName] = type;
    }

    return allFieldsPassed;
}

worker.prepareDataObject = function(dataObject, req, modelName, identifiersOnly) {

    var allFieldsPassed = true,
        metadata  = require("../metadata/" + modelName + ".json");

    for(var uiName in metadata) {
        if(identifiersOnly && !metadata[uiName].isIdentifier) {
            continue;
        }

        if(req.body[uiName] && !!metadata[uiName] && metadata[uiName].type !== "Object") {
            if(metadata[uiName].type === "[Object]") {
                var dbName          = metadata[uiName]["dbName"],
                    deepMetadata    = metadata[uiName]["deepStructure"];
                    deepArray       = [];
                for(var i=0; i<req.body[uiName].length; i++) {
                    var currDataObject = {};
                    for(var deepUiName in deepMetadata) {
                        var deepDbName = deepMetadata[deepUiName]["dbName"];
                        currDataObject[deepDbName] = req.body[uiName][i][deepUiName];
                    }
                    deepArray.push(currDataObject);
                }
                dataObject[dbName] = deepArray;
            } else {
                var dbName = metadata[uiName]["dbName"];
                dataObject[dbName] = req.body[uiName];
            }
        } else if(metadata[uiName].type === "Object") {
            var dbName          = metadata[uiName]["dbName"],
                deepMetadata    = metadata[uiName]["deepStructure"];
            dataObject[dbName] = dataObject[dbName] || {};
            for(var deepUiName in deepMetadata) {
                var deepDbName = deepMetadata[deepUiName]["dbName"];
                dataObject[dbName][deepDbName] = req.body[deepUiName];
            }
        } else {
            if(metadata[uiName].isRequired === true) {
                allFieldsPassed = false;
            }
        }
    }
    return allFieldsPassed;
};

worker.addDataObject = function (resolveParams, Model, dataObject) {
    return new Promise(function(resolve, reject) {
        var newObject   = dataObject || {},
            identifier  = {},
            req         = resolveParams[0];

        worker.prepareDataObject(identifier, req, Model.modelName, true);

        Promise.promisifyAll(Model);
        Model.findOneAsync(identifier)
        .then(function(fetchedObject) {
            if(!!fetchedObject && Object.keys(identifier).length != 0) {
                //The entity already exists, do reject
                reject(new Error("Row with parameters '" + JSON.stringify(identifier) + "' already exists in table '" + Model.modelName + "'"));
            } else {
                //The entity doesn't exist, add it
                worker.prepareDataObject(newObject, req, Model.modelName);
                if(Model.modelName === "OfferActive" && (!newObject.user || !newObject.user.id)) {
                    newObject.user = {};
                    newObject.user.id = req.user["_id"];
                    newObject.user.firstName = req.user["firstName"];
                    newObject.user.lastName = req.user["lastName"];

                    newObject.location = {};
                    newObject.location.name = req.user.location.name;
                    newObject.location.coordinates = req.user.location.coordinates;
                }
                var newModel = new Model(newObject);
                newModel.save(function(err, savedObject) {
                    if(!err) {
                        worker.trimResolveParams(resolveParams);
                        if(!!savedObject.password) savedObject.password = "****";
                        resolveParams.push(savedObject);
                        resolve(resolveParams);
                    } else {
                        var errMsg = err.errmsg || "Row could not be inserted in table '" + Model.modelName + "'";
                        reject(new Error(errMsg));
                    }
        		});
            }
        });
    });
};

worker.updateDataObject = function (resolveParams, Model) {
    return new Promise(function(resolve, reject) {

        var updateData  = {},
            req         = resolveParams[0],
            identifier  = resolveParams[3];

        if(!identifier) {
            identifier = {};
            worker.prepareDataObject(identifier, req, Model.modelName, true);
        }

        Promise.promisifyAll(Model);
        Model.findOneAsync(identifier)
        .then(function(fetchedObject) {
            if(!!fetchedObject && !fetchedObject.errmsg) {
                worker.prepareDataObject(fetchedObject, req, Model.modelName);
                fetchedObject.save(function(err, savedObject) {
                    if(!err) {
                        worker.trimResolveParams(resolveParams);
                        if(!!savedObject.password) savedObject.password = "****";
                        resolveParams.push(savedObject);
                        resolve(resolveParams);
                    } else {
                        var errMsg = err.errmsg || "Row could not be inserted in table '" + Model.modelName + "'";
                        reject(new Error(errMsg));
                    }
                });
            } else {
                var errmsg = (!!fetchedObject && !!fetchedObject.errmsg) ? fetchedObject.errmsg : "Row could not be inserted in table '" + Model.modelName + "'";
                reject(new Error(errmsg));
            }
        });
    });
};

worker.deleteDataObject = function (resolveParams, Model, identifier) {
    return new Promise(function(resolve, reject) {

        if(!identifier) {
            reject(new Error("Row identification not provided for table '" + Model.modelName + "'"))
        }
        var req = resolveParams[0],
            findFunctionName;

        Promise.promisifyAll(Model);
        Model.findOneAsync(identifier)
        .then(function(fetchedObject) {
            if(!!fetchedObject) {
                fetchedObject.remove(function (err, removedObject) {
                    if(err) {
                        reject(new Error("Row could not be deleted from table '" + Model.modelName + "'"));
                    }
                    removedObject = removedObject.toObject();
                    console.log(removedObject["_id"]);
                    worker.trimResolveParams(resolveParams);
                    resolveParams.push(removedObject);
                    resolve(resolveParams);
                })
            } else {
                reject(new Error("Row not found in the table '" + Model.modelName + "'"));
            }
        });
    });
};

worker.getDataObject = function (resolveParams, Model, locationParams) {
    return new Promise(function(resolve, reject) {

        var identifier  = resolveParams[3],
            req         = resolveParams[0],
            findFunctionName;

        if(!identifier) {
            findFunctionName = "findAsync";
            identifier = {};
            if(!!locationParams) {
                var range = (locationParams.distance || 100) / 6371; //111.12 for 2d index;
                var attribute = locationParams.attribute;
                identifier[attribute] = { $nearSphere: req.user.location.coordinates, $maxDistance: range};
            }
            worker.prepareDataObject(identifier, req, Model.modelName, true);
        } else {
            findFunctionName = "findOneAsync";
        }

        Promise.promisifyAll(Model);
        Model[findFunctionName](identifier)
        .then(function(fetchedObject) {
            worker.trimResolveParams(resolveParams);
            if(!!fetchedObject) {
                if(!!fetchedObject.password) fetchedObject.password = "****";
                resolveParams.push(fetchedObject);
            } else {
                var emptyObject = findFunctionName === "findAsync" ? [] : {}
                resolveParams.push(emptyObject);
            }
            resolve(resolveParams);
        });
    });
};

worker.trimResolveParams = function(resolveParams) {
    return resolveParams.splice(3, resolveParams.length - 3);
};

module.exports = worker;
