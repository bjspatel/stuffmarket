var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/stuffmarket1");

module.exports = mongoose;
