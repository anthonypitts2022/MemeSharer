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
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 8/7/19 *Last Mod
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
    },
    date: {
      type: Date,
      default: Date.now
    },
    fileId: {
      type: String,
      required: true,
      description: "The id of the post file content"
    },
    fileType: {
      type: String,
      required: true,
      description: "The type (extension) of the post file content"
    }
});



//==============================================================================
// !EXPORT
//==============================================================================

PostSchema.index({
  index: "text",
  userId: "text",
  date: "text",
  fileId: "text",
  fileType: "text",
});


module.exports = Post = mongoose.model("Post", PostSchema);
