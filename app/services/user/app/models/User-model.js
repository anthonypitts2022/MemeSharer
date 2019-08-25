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
const shortid = require("shortid");

//==============================================================================
// BODY
//==============================================================================

const UserShema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The User's id"
  },
  name: {
    type: String,
    text: true
  },
  email: {
    type: String,
    text: true
  },
  password: {
    type: String,
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
module.exports = User = mongoose.model("User", UserShema);
