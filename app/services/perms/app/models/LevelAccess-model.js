//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : LevelAccess-model
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/16/19 *Last Mod
!Desc  : Sets up the LevelAccess schema
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

const LevelAccessSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The id of the User Perms Object"
    },
    levelId: {
      type: String,
      description: "The id of the level object for the user's access level."
    },
    functionality: {
      type: String,
      description: "A functionality that a user has access to"
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

LevelAccessSchema.index({
  index: "text",
  levelId: "text",
  functionality: "text"
});


module.exports = LevelAccess = mongoose.model("LevelAccess", LevelAccessSchema);
