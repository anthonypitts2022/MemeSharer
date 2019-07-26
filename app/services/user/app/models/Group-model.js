//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Group-model
!Auth  : mambanerd
!Vers  : 1.0
!Date  : 6/24/19 *Last Mod
!Desc  : Sets up the group schema
*/

//==============================================================================
// HEAD
//==============================================================================

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//==============================================================================
// BODY
//==============================================================================

const GroupShema = new Schema({
  //Required
  groupName: {
    type: String,
    required: true,
    text: true
  },
  groupEmail: {
    type: String,
    required: true,
    text: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//==============================================================================
// !EXPORT
//==============================================================================

GroupShema.index({
  groupName: "text",
  groupEmail: "text"
});
module.exports = group = mongoose.model("Group", GroupShema);
