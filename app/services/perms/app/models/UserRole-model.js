/******************************************************************************
!Title : Rolel model
!Auth  : Anthony Pitts
!desc  : The database model for a user role
******************************************************************************/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");


const UserRoleSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The id of the User Role"
  },
  roleID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  }
});

module.exports = UserRole = mongoose.model("UserRole", UserRoleSchema);
