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
!Date  : 7/13/19 *Last Mod
!Desc  : Sets up the Level schema
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

const LevelSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The level Object id"
    },
    name: {
      type: String,
      description: "The name of the level."
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

LevelSchema.index({
  index: "text",
  name: "text"
});


module.exports = Level = mongoose.model("Level", LevelSchema);
