//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : RefreshToken-model
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 05/23/2020 *Last Mod
!Desc  : Sets up the RefreshToken schema
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

const RefreshTokenSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The id of the RefreshToken"
    },
    userID: {
      type: String,
      description: "The ID of the user connected to that refresh token.",
      required: true,
      text: true
    },
    secret: {
      type: String,
      description: "The secret corresponding to that refresh token.",
      required: true,
      text: true
    }
});



//==============================================================================
// !EXPORT
//==============================================================================


//text index on strings to allow for regex / complex string queries
RefreshTokenSchema.index({
  index: "text",
  userID: "text",
  secret: "text",
});


module.exports = RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
