// Checks if the  ID exists

var ObjectID = require("mongodb").ObjectID;
const isMongodbid = value => ObjectID.isValid(value);

module.exports = isMongodbid;
