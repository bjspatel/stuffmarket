module.exports = function(passport) {

    this.authentication     = require("../objects/authentication-controller")(passport);
    this.user               = require("../objects/user-controller");
    this.item               = require("../../models/item");
    this.category           = require("../../models/category");
    this.offerActive        = require("../objects/offer-active-controller");
    this.offerArchive       = require("../../models/offer-archive");

    return this;
};
