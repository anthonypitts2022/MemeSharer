//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Like-model
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 8/7/19 *Last Mod
!Desc  : Sets up the Like schema
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

const LikeSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The id of the Like"
    },
    userEmail: {
      type: String,
      description: "The email of the user connected to that post."
    },
    postId: {
      type: String,
      description: "The id of the post connected to that post."
    },
    isLike: {
      type: Boolean,
      description: "If true, like. If False, dislike"
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

LikeSchema.index({
  index: "text",
  userId: "text",
  postId: "text",
  isLike: "text"
});


module.exports = Like = mongoose.model("Like", LikeSchema);
