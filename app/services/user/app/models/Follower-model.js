//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Follower-model
!Auth  : Anthony Pitts
!Vers  : 1.0
!Desc  : Sets up the follower schema
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

const FollowerShema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
    description: "The follower Object id"
  },
  userFollowingId: {
    type: String,
    required: true,
    text: true
  },
  userBeingFollowedId: {
    type: String,
    required: true,
    text: true
  }
});

//==============================================================================
// !EXPORT
//==============================================================================

FollowerShema.index({
  index: "text",
  userFollowingId: "text",
  userBeingFollowedId: "text"
});
module.exports = Follower = mongoose.model("Follower", FollowerShema);
