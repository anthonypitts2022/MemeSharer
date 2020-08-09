//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : user-queries
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 11/21/19 *Last Mod
!Desc  : Conatins all the queries for users
*/

//==============================================================================
// Head
//==============================================================================
//---------------------------------
// Modules
//---------------------------------
require("module-alias/register");
const validateID = require("../../validation/validateID.js");
const { handleErrors } = require("@lib/handleErrors.js");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken')



//---------------------------------
// Models
//---------------------------------

const User = require("../../models/User-model.js");
//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin, Staff)
// @desc   : Get a user
const userQuery = async (root, { id }) => {
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateID(id);
    if (!isValid) throw handleErrors.invalidIDInput(msg)

    const user = await User.findOne({ id: id });
    return user;

  } catch (err) {
    console.log(err)
    handleErrors.error(err)
  }
};

// @access : Private(Root)
// @desc   : Existing users
const usersQuery = async (_, __, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to this query
    if(!accessTokenData.hasPermission(`users`)) {
      throw handleErrors.permissionDenied('Signed in user does not have access to this query')
    }

    const users = await User.find()
      .skip(0)
      .limit(200);

    return users;

  } catch (err) {
    console.log(err)
    handleErrors.error(err)
  }
};


module.exports = {
  userQuery,
  usersQuery,
};
