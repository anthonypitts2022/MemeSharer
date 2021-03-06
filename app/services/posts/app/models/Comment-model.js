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
!Desc  : Sets up the Comment schema
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

const CommentSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The id of the Comment"
    },
    userId: {
      type: String,
      description: "The id of the user connected to that post."
    },
    postId: {
      type: String,
      description: "The id of the post connected to that post."
    },
    text: {
      type: String,
      description: "The text of the comment"
    },
    date: {
      type: Date,
      default: Date.now
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

//indexing string in alphabetical order
CommentSchema.index({
  userId: 1,
  postId: 1
});

//indexing data in most-recent to least-recent order
CommentSchema.index({
  date: -1
});


CommentSchema.index({
  index: "text",
  userId: "text",
  postId: "text"
});


module.exports = Comment = mongoose.model("Comment", CommentSchema);
