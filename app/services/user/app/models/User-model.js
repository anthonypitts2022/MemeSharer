//==============================================================================
//                      _      _
//  _ __ ___   ___   __| | ___| |
// | '_ ` _ \ / _ \ / _` |/ _ \ |
// | | | | | | (_) | (_| |  __/ |
// |_| |_| |_|\___/ \__,_|\___|_|
//
//==============================================================================
/*
!Title : User-model
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 6/20/19 *Last Mod
!Desc  : Sets up the user schema
*/

//==============================================================================
// HEAD
//==============================================================================

const mongoose = require('mongoose')
const Schema = mongoose.Schema

//==============================================================================
// BODY
//==============================================================================

const UserShema = new Schema({
  id: {
    type: String,
    required: true,
    text: true
  },
  name: {
    type: String,
    required: true,
    text: true
  },
  email: {
    type: String,
    required: true,
    text: true
  },
  profileUrl: {
    type: String,
    required:true,
    text: true
  }
})

//==============================================================================
// !EXPORT
//==============================================================================

UserShema.index({
  id: 'text',
  index: 'text',
  name: 'text',
  email: 'text',
  profileUrl: 'text'
})
module.exports = user = mongoose.model('User', UserShema)
