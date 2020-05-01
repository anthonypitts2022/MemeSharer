/******************************************************************************
!Title : Permissions model
!Auth  : Anthony Pitts
!desc  : The database model for a role
******************************************************************************/
// Modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");


const PermissionSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The id of the Permission"
  },
  permName: {
    type: String,
    description: "The name of the Permission object"
  }
});

module.exports = Permission = mongoose.model("Permission", PermissionSchema);
