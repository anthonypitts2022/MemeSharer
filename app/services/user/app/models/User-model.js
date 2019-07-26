//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : User-model
!Auth  : mambanerd
!Vers  : 1.0
!Date  : 6/20/19 *Last Mod
!Desc  : Sets up the user schema
*/

//==============================================================================
// HEAD
//==============================================================================

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//==============================================================================
// BODY
//==============================================================================

const UserShema = new Schema({
  //Required
  uni: {
    type: String,
    required: true,
    text: true
  },
  firstName: {
    type: String,
    required: true,
    text: true
  },
  lastName: {
    type: String,
    required: true,
    text: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  address: {
    type: String
  },
  address2: {
    type: String
  },
  userType: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//==============================================================================
// !EXPORT
//==============================================================================

UserShema.index({
  index: "text",
  firstName: "text",
  lastName: "text",
  email: "text"
});
module.exports = user = mongoose.model("User", UserShema);
