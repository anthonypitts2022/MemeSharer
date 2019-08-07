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
!Auth  : Anthony Pitts
!Vers  : 1.0
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
  name: {
    type: String,
    required: true,
    text: true
  },
  email: {
    type: String,
    required: true,
    text: true
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
  name: "text",
  email: "text"
});
module.exports = user = mongoose.model("User", UserShema);
