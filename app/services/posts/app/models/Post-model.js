//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Post-model
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/16/19 *Last Mod
!Desc  : Sets up the Post schema
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

const PostSchema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
      description: "The id of the Post"
    },
    userId: {
      type: String,
      required: true,
      description: "The id of the user connected to that post."
    },
    caption: {
      type: String,
      description: "The post's caption"
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

PostSchema.index({
  index: "text",
  userId: "text"
});


module.exports = Post = mongoose.model("Post", PostSchema);
