//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : Followship-model
!Auth  :
!Vers  : 1.0
!Date  :
!Desc  : Creates a schema for Followship
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Modules
//---------------------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortid = require('shortid')
//==============================================================================
// BODY
//==============================================================================

const FollowshipSchema = new Schema({
  //ID required
  _id: {
    type: String,
    default: shortid.generate
  },
  followerId: {
    type: String,
    required: true,
    text: true
  },
  followeeId: {
    type: String,
    required: true,
    text: true
  },
})

//==============================================================================
// !EXPORTS
//==============================================================================
FollowshipSchema.index({
  followerId: 'text',
  followeeId: 'text',
})

//indexing string in alphabetical order
FollowshipSchema.index({
  followerId: 1,
  followeeId: 1,
})

module.exports = Followship = mongoose.model('Followship', FollowshipSchema)
