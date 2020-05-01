/******************************************************************************
!Title : Role Permissions model
!Auth  : Anthony Pitts
!desc  : The database model for a role permission
******************************************************************************/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");


const RolePermissionSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The id of the Role Permission"
  },
  roleID: {
    type: String,
    required: true
  },
  permID: {
    type: String,
    required: true
  }
});

module.exports = RolePermission = mongoose.model(
  "RolePermission",
  RolePermissionSchema
);
