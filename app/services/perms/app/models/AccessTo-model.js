//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Level-model
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/14/19 *Last Mod
!Desc  : Sets up the AccessTo schema
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

const AccessToSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The level Object id"
    },
    uni: {
      type: String,
      description: "The User's uni"
    },
    functionality: {
      type: String,
      description: "A functionality that a user has access to"
    },
    levelId: {
      type: String,
      description: "LevelId of corresponding level that has access to this functionality."
    }

});



//==============================================================================
// !EXPORT
//==============================================================================

AccessToSchema.index({
  index: "text",
  functionality: "text",
  levelId: "text",
  uni: "text"
});


module.exports = AccessTo = mongoose.model("AccessTo", AccessToSchema);
