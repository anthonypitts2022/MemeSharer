/******************************************************************************
!Title : Roles model
!Auth  : Anthony Pitts
!desc  : The role database model
******************************************************************************/
// Modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");


const RoleSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The id of the Role"
  },
  roleName: {
    type: String,
    required: true
  }
});

module.exports = Role = mongoose.model("Role", RoleSchema);
